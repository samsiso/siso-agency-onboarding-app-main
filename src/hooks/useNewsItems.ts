import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/blog';
import { format, addDays, subDays, isToday, isSameDay, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

type PostStatus = 'all' | 'draft' | 'published';

// [Analysis] Enhanced hook for managing news items with better API integration and date-based navigation
export const useNewsItems = (
  selectedCategory: string | null, 
  status: PostStatus = 'published',
  selectedDate?: string | null,
  currentPage: number = 1,
  pageSize: number = 12
) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsByDate, setNewsByDate] = useState<Record<string, NewsItem[]>>({});
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [syncingNews, setSyncingNews] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [apiUsage, setApiUsage] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeNewsSource, setActiveNewsSource] = useState<'event_registry' | 'news_api'>('event_registry');
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
    articles?: NewsItem[];
    duplicatesSkipped?: number;
  } | null>(null);
  const { toast } = useToast();

  // [Analysis] Get API status info on mount
  useEffect(() => {
    fetchApiStatus();
  }, []);

  // [Analysis] Initialize with today's articles
  useEffect(() => {
    if (selectedDate) {
      // If selectedDate is provided, convert to Date object
      setCurrentDate(new Date(selectedDate));
    } else {
      // Start with today's date and fetch articles
      fetchNewsByDate(new Date());
    }
  }, [selectedDate]);

  // [Analysis] Fetch when date, category or status changes
  useEffect(() => {
    if (selectedDate) {
      fetchNews();
    }
  }, [selectedCategory, status, selectedDate, currentPage]);

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
      
      // [Analysis] Calculate API usage percentage - assuming 2000 calls/month limit
      const usagePercentage = ((count || 0) / 2000) * 100;
      
      setApiUsage(usagePercentage);
      setArticleCount(count || 0);
      
      // Get last sync time from news_sources
      const { data: sourceData } = await supabase
        .from('news_sources')
        .select('last_fetched_at, source_type')
        .order('last_fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (sourceData) {
        const syncDate = new Date(sourceData.last_fetched_at);
        setLastSync(syncDate.toLocaleString());
        setActiveNewsSource(sourceData.source_type as 'event_registry' | 'news_api');
      } else {
        // Fallback to checking latestArticle
        const { data: latestArticle } = await supabase
          .from('ai_news')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (latestArticle) {
          const syncDate = new Date(latestArticle.created_at);
          setLastSync(syncDate.toLocaleString());
        }
      }

      // Fetch available date range for navigation
      fetchAvailableDates();
    } catch (error) {
      console.error('Error fetching API status:', error);
    }
  };

  // [Analysis] Fetch the range of dates that have articles
  const fetchAvailableDates = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_news')
        .select('date')
        .eq('status', 'published')
        .order('date', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Extract unique dates
        const uniqueDates = [...new Set(data.map(item => item.date))];
        setDateRange(uniqueDates);
      }
    } catch (error) {
      console.error('Error fetching available dates:', error);
    }
  };

  // [Analysis] Enhanced fetchNews function with better error handling and data transformation
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
      
      // [Analysis] Transform data for compatibility with UI components
      if (data) {
        const transformedData = transformNewsItems(data);
        setNewsItems(transformedData);
      } else {
        setNewsItems([]);
      }

      // [Analysis] Fetch associated summaries
      fetchSummaries();
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
      setInitialLoading(false);
    }
  };

  // [Analysis] New function to fetch news by specific date - with modifications to handle empty dates better
  const fetchNewsByDate = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Fetching news for date:', formattedDate);
      
      // Check if we already have this date's data cached
      if (newsByDate[formattedDate] && newsByDate[formattedDate].length > 0) {
        console.log('Using cached data for date:', formattedDate);
        setNewsItems(newsByDate[formattedDate]);
        setCurrentDate(date);
        setLoading(false);
        return;
      }
      
      let query = supabase
        .from('ai_news')
        .select('*, profiles:author_id(full_name, avatar_url)')
        .eq('date', formattedDate)
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching news for date:', fetchError);
        throw fetchError;
      }

      console.log(`Fetched ${data?.length} articles for ${formattedDate}`);
      
      // [Analysis] Transform data and update state
      if (data && data.length > 0) {
        const transformedData = transformNewsItems(data);
        
        // Update the newsByDate state
        setNewsByDate(prev => ({
          ...prev,
          [formattedDate]: transformedData
        }));
        
        // Update current articles
        setNewsItems(transformedData);
      } else {
        // If no articles found, store empty array - important for navigation
        setNewsByDate(prev => ({
          ...prev,
          [formattedDate]: []
        }));
        
        // Clear current news items - we'll show empty state
        setNewsItems([]);
        
        // No need for toast here anymore - we'll show the empty state UI instead
      }
      
      // Always update current date even if empty
      setCurrentDate(date);
      
      // [Analysis] Fetch associated summaries if any articles exist
      if (data && data.length > 0) {
        fetchSummaries();
      }
    } catch (error) {
      console.error('Error in fetchNewsByDate:', error);
      setError(error as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news articles for the selected date. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // [Analysis] New function to fetch news within a date range (for week/month views)
  const fetchNewsInRange = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      console.log(`Fetching news from ${formattedStartDate} to ${formattedEndDate}`);
      
      let query = supabase
        .from('ai_news')
        .select('*, profiles:author_id(full_name, avatar_url)')
        .gte('date', formattedStartDate)
        .lte('date', formattedEndDate)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (status !== 'all') {
        query = query.eq('status', status);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching news for date range:', fetchError);
        throw fetchError;
      }

      console.log(`Fetched ${data?.length} articles for range ${formattedStartDate} to ${formattedEndDate}`);
      
      // [Analysis] Transform data and update state
      if (data && data.length > 0) {
        const transformedData = transformNewsItems(data);
        setNewsItems(transformedData);
        
        // Fetch summaries for these articles
        const articleIds = transformedData.map(item => item.id);
        fetchSummariesByIds(articleIds);
      } else {
        setNewsItems([]);
        toast({
          description: `No articles found for this ${startDate === endDate ? 'date' : 'period'}.`,
        });
      }
    } catch (error) {
      console.error('Error in fetchNewsInRange:', error);
      setError(error as Error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news articles for the selected range. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch summaries by article IDs
  const fetchSummariesByIds = async (articleIds: string[]) => {
    if (!articleIds.length) return;
    
    try {
      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary')
        .in('news_id', articleIds);

      if (summariesError) throw summariesError;

      if (summariesData) {
        const summariesMap = summariesData.reduce((acc: Record<string, string>, curr) => {
          acc[curr.news_id] = curr.summary;
          return acc;
        }, {});
        setSummaries(prev => ({...prev, ...summariesMap}));
      }
    } catch (error) {
      console.error('Error fetching summaries by IDs:', error);
    }
  };

  // [Analysis] Handle changing to the next day (newer articles) - modified to allow navigation even with no articles
  const goToNextDay = useCallback(() => {
    const nextDay = addDays(currentDate, 1);
    
    // Don't go beyond today
    if (nextDay > new Date()) {
      toast({
        title: "No newer articles",
        description: "You're already viewing the most recent articles.",
      });
      return;
    }
    
    fetchNewsByDate(nextDay);
  }, [currentDate]);

  // [Analysis] Handle changing to the previous day (older articles) - now allowing all date navigation
  const goToPreviousDay = useCallback(() => {
    const previousDay = subDays(currentDate, 1);
    fetchNewsByDate(previousDay);
  }, [currentDate]);

  // [Analysis] Jump to a specific date
  const goToDate = useCallback((date: Date) => {
    fetchNewsByDate(date);
  }, []);

  // [Analysis] Function to transform raw news items with derived properties
  const transformNewsItems = (data: any[]): NewsItem[] => {
    return data.map(item => {
      // Calculate article metrics if not present
      const views = item.views || Math.floor(Math.random() * 1000);
      const bookmarks = item.bookmarks || Math.floor(Math.random() * 100);
      
      // Determine article complexity based on content length and keywords
      const content = item.content || item.description || '';
      const technicalTerms = [
        'algorithm', 'neural network', 'machine learning', 'deep learning',
        'transformer', 'parameter', 'optimization', 'gradient descent'
      ];
      
      const technicalTermCount = technicalTerms.reduce((count, term) => {
        return count + (content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
      }, 0);
      
      let technicalComplexity = item.technical_complexity || 'intermediate';
      if (!item.technical_complexity) {
        if (technicalTermCount > 5 || content.length > 3000) {
          technicalComplexity = 'advanced';
        } else if (technicalTermCount > 2 || content.length > 1000) {
          technicalComplexity = 'intermediate';
        } else {
          technicalComplexity = 'beginner';
        }
      }
      
      // Calculate estimated reading time based on content length
      const wordCount = (content.match(/\S+/g) || []).length;
      const readingTime = item.reading_time || Math.max(1, Math.ceil(wordCount / 200));
      
      // Determine impact based on title and category
      const highImpactTerms = ['revolutionary', 'breakthrough', 'major', 'groundbreaking'];
      const titleHasHighImpact = highImpactTerms.some(term => 
        (item.title || '').toLowerCase().includes(term)
      );
      
      let impact = item.impact || 'medium';
      if (!item.impact) {
        if (titleHasHighImpact || item.category === 'breakthrough_technologies') {
          impact = 'high';
        } else if (item.category === 'industry_applications') {
          impact = 'medium';
        } else {
          impact = 'low';
        }
      }
      
      // [Analysis] Safely handle properties that might not exist in the database schema
      // but are needed in the UI
      return {
        ...item,
        // Set a default template_type even though it doesn't exist in the database
        template_type: 'article', // Adding this as a default value instead of accessing it from item
        article_type: item.article_type || 'article',
        technical_complexity: technicalComplexity,
        reading_time: readingTime,
        views,
        bookmarks,
        impact,
        source_credibility: item.source_credibility || 'verified',
        // Ensure URL is properly handled
        url: item.url || null
      };
    });
  };

  // [Analysis] Fetch summaries for current articles
  const fetchSummaries = async () => {
    try {
      // Extract IDs of current articles
      const articleIds = newsItems.map(item => item.id);
      
      if (articleIds.length === 0) return;
      
      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary')
        .in('news_id', articleIds);

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

  // [Analysis] Function to test fetch news without actually storing in database
  const testFetchNews = async (
    keyword: string = "artificial intelligence",
    limit: number = 10,
    source: 'event_registry' | 'news_api' = activeNewsSource
  ) => {
    setSyncingNews(true);
    setSyncResult(null);
    
    try {
      console.log(`Starting test news fetch from ${source}...`);
      
      const functionName = 'fetch-ai-news';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          keyword: keyword,
          limit: limit,
          testMode: true, // Set test mode to true
          source: source,
          skipDuplicates: false // Don't filter duplicates in test mode to show all potential articles
        },
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data returned from edge function');
      }

      // Check for duplicates in test results and mark them
      if (data.articles && data.articles.length > 0) {
        const existingTitles = new Set<string>();
        let duplicateCount = 0;
        
        // First pass: collect existing titles
        for (const article of data.articles) {
          const normalizedTitle = article.title.toLowerCase().trim();
          if (existingTitles.has(normalizedTitle)) {
            article.isDuplicate = true;
            duplicateCount++;
          } else {
            existingTitles.add(normalizedTitle);
            article.isDuplicate = false;
          }
        }
        
        // Set result with duplicate count
        setSyncResult({
          success: data.success,
          message: `Found ${data.articles.length} articles, with ${duplicateCount} potential duplicates`,
          count: data.articles.length - duplicateCount,
          articles: data.articles,
          duplicatesSkipped: duplicateCount
        });
      } else {
        setSyncResult({
          success: data.success,
          message: data.message || "No articles found",
          count: 0,
          articles: [],
          duplicatesSkipped: 0
        });
      }
      
      toast({
        title: "Test fetch completed",
        description: `Found ${data.articles?.length || 0} articles from ${source}`,
      });
      
      return data;
    } catch (error) {
      console.error('Error in test fetch:', error);
      setSyncResult({
        success: false,
        message: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        variant: "destructive",
        title: "Test Fetch Error",
        description: error instanceof Error ? error.message : "Failed to test fetch AI news",
      });
      throw error;
    } finally {
      setSyncingNews(false);
    }
  };

  // [Analysis] Function to sync news from a specific API source with improved error handling
  // Added support for date override to generate articles for specific dates
  const syncNews = async (
    keyword: string = "artificial intelligence", 
    limit: number = 20, 
    source: 'event_registry' | 'news_api' = activeNewsSource,
    testMode: boolean = false,
    skipDuplicates: boolean = true,
    dateOverride: string | null = null  // New parameter for date override
  ) => {
    setSyncingNews(true);
    setSyncResult(null);
    
    try {
      console.log(`Starting news sync from ${source}...`, {
        keyword,
        limit,
        source,
        testMode,
        skipDuplicates,
        dateOverride
      });
      
      // [Analysis] Determine which edge function to call based on source
      const functionName = 'fetch-ai-news';
      
      console.log(`Calling edge function: ${functionName}`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          keyword: keyword,
          limit: limit,
          testMode: testMode, // Flag to determine if articles should be imported
          source: source,
          skipDuplicates: skipDuplicates, // Whether to filter duplicates
          dateOverride: dateOverride // Pass date override to edge function
        },
      });

      if (error) {
        console.error(`Edge function error:`, error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from edge function');
        throw new Error('No data returned from edge function');
      }

      console.log('Edge function response:', data);

      // Check for specific errors in the response
      if (data.errors && data.errors.length > 0) {
        console.warn('Specific errors occurred during import:', data.errors);
      }

      // [Analysis] Transform API articles to match our NewsItem interface
      if (data.articles && data.articles.length > 0) {
        const processedArticles = data.articles.map((article: any, index: number) => {
          // Extract domain from URL for source
          let source = article.source || 'Unknown';
          if (article.url) {
            try {
              const urlObj = new URL(article.url);
              source = urlObj.hostname.replace('www.', '');
            } catch (e) {
              // Keep original source if URL parsing fails
              console.log(`Could not parse URL for article: ${article.title}`, e);
            }
          }
          
          // Generate readable ID if not provided
          const id = article.id || `article-${Date.now()}-${index}`;
          
          // Clean up and standardize content
          const content = article.content || article.description || '';
          
          // Calculate metrics
          const wordCount = (content.match(/\S+/g) || []).length;
          const readingTime = Math.max(1, Math.ceil(wordCount / 200));
          
          // Determine impact based on title
          const highImpactTerms = ['revolutionary', 'breakthrough', 'major', 'groundbreaking'];
          const titleHasHighImpact = highImpactTerms.some(term => 
            (article.title || '').toLowerCase().includes(term)
          );
          
          let impact = 'medium';
          if (titleHasHighImpact) {
            impact = 'high';
          }
          
          // Use the date override if provided, otherwise use the article date or today
          const articleDate = dateOverride || article.date || new Date().toISOString().split('T')[0];
          
          return {
            id,
            title: article.title || 'Untitled Article',
            description: article.description || '',
            content: content,
            date: articleDate,
            category: article.category || 'breakthrough_technologies',
            article_type: 'news',
            created_at: article.date || new Date().toISOString(),
            author_id: null,
            image_url: article.image_url || '',
            source: source,
            source_credibility: 'verified',
            technical_complexity: 'intermediate',
            impact: impact,
            views: Math.floor(Math.random() * 500),
            bookmarks: Math.floor(Math.random() * 50),
            reading_time: readingTime,
            featured: index === 0, // Mark first article as featured
            url: article.url || null, // Handle null URLs
            status: 'published',
            template_type: 'article', // Default template type
            isDuplicate: article.isDuplicate || false // Mark duplicates for UI highlighting
          };
        });
        
        // Update the result with processed articles
        data.articles = processedArticles;
      }

      // [Analysis] Store the result for testing display
      setSyncResult({
        success: data.success,
        message: data.message,
        count: data.count,
        articles: data.articles,
        duplicatesSkipped: data.duplicatesSkipped || 0
      });

      if (data.success) {
        toast({
          title: testMode ? "Test sync completed" : "News synced successfully",
          description: `${data.count} articles ${testMode ? 'retrieved' : 'imported'} from ${source === 'event_registry' ? 'Event Registry' : 'News API'}${data.duplicatesSkipped ? `, ${data.duplicatesSkipped} duplicates skipped` : ''}`,
        });
        
        // [Analysis] Update active news source
        setActiveNewsSource(source);
        
        // Refresh data and status
        if (!testMode) {
          fetchNews();
          fetchApiStatus();
          fetchAvailableDates();
          
          // If date override is used, make sure to refresh data for that date
          if (dateOverride) {
            const dateObj = new Date(dateOverride);
            if (isSameDay(currentDate, dateObj)) {
              fetchNewsByDate(dateObj);
            }
          } 
          // If articles were imported for today, refresh the current view
          else if (isSameDay(currentDate, new Date())) {
            fetchNewsByDate(new Date());
          }
        }
      } else {
        throw new Error(data.message || "Failed to sync news");
      }
      
      return data;
    } catch (error) {
      console.error('Error syncing news:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
      
      // [Analysis] Store the error result for testing display
      setSyncResult({
        success: false,
        message: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: error instanceof Error ? error.message : "Failed to sync AI news",
      });
      // Re-throw to allow parent components to handle
      throw error;
    } finally {
      setSyncingNews(false);
    }
  };

  // [Analysis] Generate summary using OpenAI with caching
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
          message: `Please provide a brief 2-3 sentence summary of this news article: ${newsItem.title}. ${newsItem.description || newsItem.content || ''}`,
          systemPrompt: "You are a concise news summarizer. Provide brief, factual summaries focused on AI technology implications."
        },
      });

      if (error) throw error;

      const summary = data?.response || `${newsItem.title} discusses advancements in AI technology with potential impacts on ${newsItem.category?.replace(/_/g, ' ')}.`;

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

  // [Analysis] Switch between news sources
  const switchNewsSource = (source: 'event_registry' | 'news_api') => {
    if (source !== activeNewsSource) {
      setActiveNewsSource(source);
      // Optionally re-fetch with the new source
      toast({
        title: "News Source Changed",
        description: `Switched to ${source === 'event_registry' ? 'Event Registry' : 'News API'} as the data source`,
      });
    }
  };

  // [Analysis] Get articles for current date
  const getCurrentDateArticles = useCallback(() => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    return newsByDate[formattedDate] || [];
  }, [currentDate, newsByDate]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      // This is for infinite scrolling if we want to keep it as an option
      // Currently we use traditional pagination
    }
  }, [loading, hasMore]);

  return {
    newsItems: getCurrentDateArticles().length > 0 ? getCurrentDateArticles() : newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    initialLoading,
    syncingNews,
    hasMore,
    loadMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    switchNewsSource,
    syncResult,
    error,
    currentDate,
    dateRange,
    goToNextDay,
    goToPreviousDay,
    goToDate,
    refresh: fetchNews,
    syncNews,
    testFetchNews, // Add test function to the hook's return value
    fetchNewsInRange // Add the new function for fetching date ranges
  };
};
