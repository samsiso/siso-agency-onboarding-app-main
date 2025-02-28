
import { useState, useEffect } from 'react';
import { useNewsItems } from '@/hooks/useNewsItems';
import NewsFilters from '@/components/ai-news/NewsFilters';
import FeaturedNewsHero from '@/components/ai-news/FeaturedNewsHero';
import { NewsContent } from '@/components/ai-news/NewsContent';
import NewsHeader from '@/components/ai-news/NewsHeader';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { DailyStatsOverview } from '@/components/ai-news/DailyStatsOverview';
import { Helmet } from 'react-helmet';
import { Sidebar } from '@/components/Sidebar';
import NewsPagination from '@/components/ai-news/NewsPagination';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, Clock, AlertCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// [Analysis] Main component for the AI News page with improved visualization for news metrics
const AINews = () => {
  // [Analysis] State for filters, search, and pagination
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRecent, setShowRecent] = useState(false);
  const itemsPerPage = 12; // Same as PAGE_SIZE in useNewsItems

  const { 
    newsItems, 
    summaries, 
    loadingSummaries, 
    generateSummary, 
    loading,
    hasMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    error,
    refresh,
  } = useNewsItems(
    selectedCategory, 
    'published', 
    showRecent ? format(subDays(new Date(), 7), 'yyyy-MM-dd') : selectedDate, 
    currentPage, 
    itemsPerPage
  );

  console.log('Rendering AINews component with', newsItems.length, 'news items');
  console.log('Last sync:', lastSync);
  console.log('Article count:', articleCount);
  console.log('Loading state:', loading);
  console.log('Error state:', error ? (error instanceof Error ? error.message : String(error)) : 'none');

  // [Analysis] Find featured article with priority on featured flag and then on views
  const featuredArticle = newsItems.find(item => item.featured) || 
    [...newsItems].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  if (featuredArticle) {
    console.log('Featured article found:', featuredArticle.id, featuredArticle.title);
  } else {
    console.log('No featured article available');
  }

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

  // [Analysis] Calculate total pages
  const totalPages = totalCount ? Math.ceil(totalCount / itemsPerPage) : 0;

  // Determine when to show the stats and featured article
  const showStatsAndFeatured = !searchQuery && !selectedDate && !selectedCategory && currentPage === 1;

  return (
    <div className="flex min-h-screen bg-siso-bg">
      <Helmet>
        <title>AI News | Your One-Stop AI Knowledge Source</title>
        <meta name="description" content="Stay updated with the latest news in artificial intelligence, machine learning, and AI tools." />
      </Helmet>
      
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <NewsHeader title="AI News" />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "There was an error loading the news."}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-8">
          <div className="w-full">
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
        </div>
        
        <NewsErrorBoundary>
          {/* Daily Stats Overview - Only show on homepage view */}
          {showStatsAndFeatured && (
            <div className="mb-8">
              <DailyStatsOverview 
                newsItems={newsItems} 
                lastSync={lastSync}
                articleCount={articleCount}
                loading={loading}
              />
            </div>
          )}
          
          {/* Featured Article - Only show on homepage view */}
          {featuredArticle && showStatsAndFeatured && !showRecent && (
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
            newsItems={showStatsAndFeatured && !showRecent && featuredArticle ? 
              newsItems.filter(item => item.id !== featuredArticle.id) : 
              newsItems}
            searchQuery={searchQuery}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={generateSummary}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={refresh}
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
