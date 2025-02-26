
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/blog';

type PostStatus = 'all' | 'draft' | 'published';

export const useNewsItems = (
  selectedCategory: string | null, 
  status: PostStatus = 'published',
  selectedDate?: string | null
) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);

  // [Analysis] Reset pagination when filters change
  useEffect(() => {
    setPage(0);
    setNewsItems([]);
    fetchNews();
  }, [selectedCategory, status, selectedDate]);

  // [Analysis] Load more data when page changes
  useEffect(() => {
    if (page > 0) {
      fetchNews();
    }
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching news...', { selectedCategory, page, status, selectedDate });
      
      let query = supabase
        .from('ai_news')
        .select('*, profiles:author_id(full_name, avatar_url)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      if (selectedDate) {
        query = query.eq('date', selectedDate);
      }

      if (!selectedDate) {
        query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching news:', fetchError);
        throw fetchError;
      }

      console.log('Fetched news articles:', data?.length);

      setHasMore(data && data.length === PAGE_SIZE);
      
      // [Analysis] Determine template_type based on article properties
      const transformedData = data?.map(item => ({
        ...item,
        template_type: item.banner_template_id ? 'daily_brief' : 'article',
        article_type: item.article_type || 'article'
      })) || [];
      
      setNewsItems(prev => page === 0 ? transformedData : [...prev, ...transformedData]);

      // [Analysis] Fetch associated summaries
      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary');

      if (summariesError) {
        console.error('Error fetching summaries:', summariesError);
        throw summariesError;
      }

      if (summariesData) {
        const summariesMap = summariesData.reduce((acc: Record<string, string>, curr) => {
          acc[curr.news_id] = curr.summary;
          return acc;
        }, {});
        setSummaries(prev => ({...prev, ...summariesMap}));
      }
    } catch (error) {
      console.error('Error in fetchNews:', error);
      setError(error as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news articles. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (id: string) => {
    // [Analysis] Skip if summary already exists
    if (summaries[id]) return;
    
    setLoadingSummaries(prev => ({ ...prev, [id]: true }));
    const newsItem = newsItems.find(item => item.id === id);
    
    if (!newsItem) {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      return;
    }

    try {
      // [Analysis] Check if summary already exists in the database
      const { data: existingSummary, error: fetchError } = await supabase
        .from('ai_news_summaries')
        .select('summary')
        .eq('news_id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingSummary) {
        setSummaries(prev => ({ ...prev, [id]: existingSummary.summary }));
        setLoadingSummaries(prev => ({ ...prev, [id]: false }));
        return;
      }

      // [Analysis] Generate a new summary using the edge function
      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { 
          message: `Please provide a brief 2-3 sentence summary of this news article: ${newsItem.title}. ${newsItem.description || newsItem.content}`,
          systemPrompt: "You are a concise news summarizer. Provide brief, factual summaries focused on AI technology implications."
        },
      });

      if (error) throw error;

      const summary = data.response;

      // [Analysis] Store the summary in the database for future use
      const { error: insertError } = await supabase
        .from('ai_news_summaries')
        .insert([{ news_id: id, summary }]);

      if (insertError) throw insertError;

      setSummaries(prev => ({ ...prev, [id]: summary }));
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
    }
  };

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  return {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    hasMore,
    loadMore,
    error,
    refresh: () => {
      setPage(0);
      setNewsItems([]);
      fetchNews();
    }
  };
};
