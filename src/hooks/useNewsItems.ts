
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

// [Analysis] Added clear types for news items
export type NewsItem = {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  article_type: string;
  created_at: string;
  author_id: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  status?: string;
  views?: number;
  source?: string;
  source_credibility?: string;
  technical_complexity?: string;
  impact?: string;
  image_url?: string;
  reading_time?: number;
  bookmarks?: number;
};

type PostStatus = 'all' | 'draft' | 'published';

export const useNewsItems = (
  selectedCategory: string | null, 
  status: PostStatus = 'published',
  selectedDate?: string
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

  // [Analysis] Reset page when filter parameters change
  useEffect(() => {
    setPage(0);
  }, [selectedCategory, status, selectedDate]);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, page, status, selectedDate]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching blog posts...', { selectedCategory, page, status, selectedDate });
      
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

      // [Analysis] More precise date handling
      if (selectedDate) {
        // Exact date match
        query = query.eq('date', selectedDate);
      }

      // Only apply pagination when not filtering by date
      if (!selectedDate) {
        query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching posts:', fetchError);
        throw fetchError;
      }

      console.log('Fetched blog posts:', data?.length, 'for date:', selectedDate || 'all dates');

      // Only set hasMore if we're not filtering by date
      if (!selectedDate) {
        setHasMore(data && data.length === PAGE_SIZE);
      } else {
        // When filtering by date, there's no more data beyond what we got
        setHasMore(false);
      }
      
      // [Analysis] Handle article_type consistently
      const transformedData = data?.map(item => ({
        ...item,
        article_type: item.article_type || 'article'
      })) || [];
      
      // Reset newsItems when page is 0 (new search/filter)
      setNewsItems(prev => page === 0 ? transformedData : [...prev, ...transformedData]);

      // Fetch summaries for displayed news items
      fetchSummaries(transformedData);
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

  // [Analysis] Separate function to fetch summaries for better code organization
  const fetchSummaries = async (items: NewsItem[]) => {
    try {
      if (!items.length) return;
      
      // Get IDs of items that need summaries
      const itemIds = items.map(item => item.id);
      
      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary')
        .in('news_id', itemIds);

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
      console.error('Error fetching summaries:', error);
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

      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
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
    error,
    refetch: fetchNews // [Analysis] Added explicit refetch function for manual refreshes
  };
};
