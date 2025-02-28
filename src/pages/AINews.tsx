
import { useState, useEffect } from 'react';
import { useNewsItems } from '@/hooks/useNewsItems';
import NewsFilters from '@/components/ai-news/NewsFilters';
import FeaturedNewsHero from '@/components/ai-news/FeaturedNewsHero';
import { NewsContent } from '@/components/ai-news/NewsContent';
import NewsHeader from '@/components/ai-news/NewsHeader';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { NewsApiStatus } from '@/components/ai-news/NewsApiStatus'; 
import { Helmet } from 'react-helmet';
import { Sidebar } from '@/components/Sidebar';
import NewsPagination from '@/components/ai-news/NewsPagination';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const AINews = () => {
  // [Analysis] State for filters, search, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRecent, setShowRecent] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const itemsPerPage = 12; // Same as PAGE_SIZE in useNewsItems

  const { 
    newsItems, 
    summaries, 
    loadingSummaries, 
    generateSummary, 
    loading,
    syncingNews,
    hasMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    switchNewsSource,
    loadMore, 
    error,
    refresh,
    syncNews
  } = useNewsItems(
    selectedCategory, 
    'published', 
    showRecent ? format(subDays(new Date(), 7), 'yyyy-MM-dd') : selectedDate, 
    currentPage, 
    itemsPerPage
  );

  // [Analysis] Find featured article with priority on featured flag and then on views
  const featuredArticle = newsItems.find(item => item.featured) || 
    [...newsItems].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  // [Analysis] Add scroll restoration to preserve user's position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedDate, currentPage, showRecent]);

  // [Analysis] Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
    
    // [Analysis] Disable recent filter when searching
    if (query && showRecent) {
      setShowRecent(false);
    }
  };

  // [Analysis] Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // [Analysis] Handle recent toggle
  const toggleRecent = () => {
    if (showRecent) {
      setShowRecent(false);
    } else {
      setShowRecent(true);
      setSelectedDate(null); // Clear any date filter
      setCurrentPage(1); // Reset to first page
      toast({
        title: "Showing recent articles",
        description: "Displaying articles published in the last 7 days",
      });
    }
  };

  // [Analysis] Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // [Analysis] Handle date change
  const handleDateChange = (date: string | null) => {
    setSelectedDate(date);
    setCurrentPage(1); // Reset to first page on date change
    
    // [Analysis] Disable recent filter when selecting a specific date
    if (date && showRecent) {
      setShowRecent(false);
    }
  };

  // [Analysis] Handle news source change with improved error handling
  const handleSourceChange = (source: 'event_registry' | 'news_api') => {
    if (switchNewsSource) {
      try {
        switchNewsSource(source);
        // Reset any previous sync errors
        setSyncError(null);
        // Optionally refresh the news or reset filters
        refresh();
      } catch (err) {
        console.error("Error switching news source:", err);
        setSyncError("Failed to switch news source");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to switch news source. Please try again.",
        });
      }
    }
  };

  // [Analysis] Handle sync news with better error handling
  const handleSyncNews = async (keyword: string, limit: number, source?: 'event_registry' | 'news_api') => {
    setSyncError(null); // Reset error state before attempting sync
    try {
      if (syncNews) {
        await syncNews(keyword, limit, source);
      }
    } catch (err) {
      console.error("Error syncing news:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to sync news";
      setSyncError(errorMessage);
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Failed to send a request to the Edge Function. Please check your network connection and try again.",
      });
    }
  };

  // [Analysis] Calculate total pages
  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  return (
    <div className="flex min-h-screen bg-siso-bg">
      <Helmet>
        <title>AI News | Your One-Stop AI Knowledge Source</title>
        <meta name="description" content="Stay updated with the latest news in artificial intelligence, machine learning, and AI tools." />
      </Helmet>
      
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <NewsHeader title="AI News" />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
              <Button 
                variant={showRecent ? "default" : "outline"}
                size="sm"
                onClick={toggleRecent}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Recently Published
              </Button>
              
              {showRecent && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>Last 7 days</span>
                </div>
              )}
            </div>
            
            <NewsFilters
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onDateChange={handleDateChange}
              selectedDate={selectedDate}
            />
          </div>
          <div className="lg:col-span-1">
            <NewsApiStatus 
              onRefresh={refresh}
              syncNews={handleSyncNews}
              lastSync={lastSync}
              articleCount={articleCount}
              apiUsage={apiUsage}
              syncingNews={syncingNews}
              activeNewsSource={activeNewsSource}
              switchNewsSource={handleSourceChange}
              syncError={syncError}
            />
          </div>
        </div>
        
        <NewsErrorBoundary>
          {featuredArticle && !searchQuery && !selectedDate && !selectedCategory && currentPage === 1 && !showRecent && (
            <div className="mb-8">
              <FeaturedNewsHero 
                article={featuredArticle}
                onGenerateSummary={generateSummary}
                summary={summaries[featuredArticle.id] || ""}
                loadingSummary={loadingSummaries[featuredArticle.id] || false}
              />
            </div>
          )}
          
          <NewsContent
            newsItems={searchQuery || selectedDate || selectedCategory || currentPage > 1 || showRecent ? 
              newsItems : 
              newsItems.filter(item => item.id !== featuredArticle?.id)}
            searchQuery={searchQuery}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={generateSummary}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
          
          {totalPages > 1 && (
            <div className="mt-8">
              <NewsPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </NewsErrorBoundary>
      </main>
    </div>
  );
};

export default AINews;
