
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// [Analysis] Added status type for draft/published filtering
type PostStatus = 'all' | 'draft' | 'published';

export const useNewsItems = (selectedCategory: string | null, status: PostStatus = 'published') => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  // [Analysis] Added pagination config
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, page, status]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching blog posts...', { selectedCategory, page, status });
      
      let query = supabase
        .from('ai_news')
        .select('*, profiles:author_id(full_name, avatar_url)')
        .order('date', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      // [Analysis] Added status filtering
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching posts:', fetchError);
        throw fetchError;
      }

      console.log('Fetched blog posts:', data?.length);

      // [Analysis] Check if we have more items to load
      setHasMore(data && data.length === PAGE_SIZE);
      
      // [Analysis] Append new items to existing ones for infinite scroll
      setNewsItems(prev => page === 0 ? data || [] : [...prev, ...(data || [])]);

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
        setSummaries(summariesMap);
      }
    } catch (error) {
      console.error('Error in fetchNews:', error);
      setError(error as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch blog posts. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (id: string) => {
    if (summaries[id]) return;
    
    setLoadingSummaries(prev => ({ ...prev, [id]: true }));
    const newsItem = newsItems.find(item => item.id === id);
    
    if (!newsItem) {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      return;
    }

    try {
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

      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { 
          message: `Please provide a brief 2-3 sentence summary of this blog post: ${newsItem.title}. ${newsItem.description || newsItem.content}`,
          systemPrompt: "You are a concise blog summarizer. Provide brief, factual summaries."
        },
      });

      if (error) throw error;

      const summary = data.response;

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

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    hasMore,
    loadMore,
    error
  };
};
