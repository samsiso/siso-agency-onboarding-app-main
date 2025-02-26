
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/blog';

type PostStatus = 'all' | 'draft' | 'published';

export const useNewsItems = (
  selectedCategory: string | null, 
  status: PostStatus = 'published',
  selectedDate?: string | null,
  currentPage: number = 1,
  pageSize: number = 12
) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [syncingNews, setSyncingNews] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [apiUsage, setApiUsage] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const { toast } = useToast();

  // [Analysis] Reset when filters change
  useEffect(() => {
    fetchNews();
  }, [selectedCategory, status, selectedDate, currentPage]);

  // [Analysis] Get API status info on mount
  useEffect(() => {
    fetchApiStatus();
  }, []);

  // [Analysis] Fetch API status metrics
  const fetchApiStatus = async () => {
    try {
      // Get the count of articles from current month
      const currentDate = new Date();
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayStr = firstDay.toISOString().split('T')[0];
      
      const { count, error } = await supabase
        .from('ai_news')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayStr);
      
      if (error) throw error;
      
      // We're assuming each article creation used one API call
      // API limit is 2000 calls per month
      const usagePercentage = ((count || 0) / 2000) * 100;
      
      setApiUsage(usagePercentage);
      setArticleCount(count || 0);
      
      // Get last sync time
      const { data: latestArticle } = await supabase
        .from('ai_news')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (latestArticle) {
        const syncDate = new Date(latestArticle.created_at);
        setLastSync(syncDate.toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching API status:', error);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching news...', { selectedCategory, currentPage, status, selectedDate });
      
      // [Analysis] First fetch count for pagination
      let countQuery = supabase
        .from('ai_news')
        .select('id', { count: 'exact' });
        
      if (status !== 'all') {
        countQuery = countQuery.eq('status', status);
      }

      if (selectedCategory) {
        countQuery = countQuery.eq('category', selectedCategory);
      }

      if (selectedDate) {
        countQuery = countQuery.eq('date', selectedDate);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      setTotalCount(count || 0);
      
      // [Analysis] Then fetch data with pagination
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

      // [Analysis] Calculate pagination range
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching news:', fetchError);
        throw fetchError;
      }

      console.log('Fetched news articles:', data?.length);

      // [Analysis] Check if there are more items to load
      setHasMore(data && data.length === pageSize && from + data.length < (count || 0));
      
      // [Analysis] Determine template_type based on article properties
      const transformedData = data?.map(item => ({
        ...item,
        template_type: item.banner_template_id ? 'daily_brief' : 'article',
        article_type: item.article_type || 'article'
      })) || [];
      
      setNewsItems(transformedData);

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

  const syncNews = async (keyword: string = "artificial intelligence", limit: number = 20) => {
    setSyncingNews(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-ai-news', {
        body: { 
          keyword: keyword,
          limit: limit
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "News synced successfully",
          description: `${data.count} articles imported`,
        });
        // Refresh data and status
        fetchNews();
        fetchApiStatus();
      } else {
        throw new Error(data.message || "Failed to sync news");
      }
    } catch (error) {
      console.error('Error syncing news:', error);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: error.message || "Failed to sync AI news",
      });
    } finally {
      setSyncingNews(false);
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
      // This is for infinite scrolling if we want to keep it as an option
      // Currently we use traditional pagination
    }
  }, [loading, hasMore]);

  return {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    syncingNews,
    hasMore,
    loadMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    error,
    refresh: fetchNews,
    syncNews
  };
};
