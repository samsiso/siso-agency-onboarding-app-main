
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

const AINews = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { 
    newsItems, 
    summaries, 
    loadingSummaries, 
    generateSummary, 
    loading, 
    hasMore, 
    loadMore, 
    error,
    refresh
  } = useNewsItems(selectedCategory, 'published', selectedDate);

  // [Analysis] Find featured article with priority on featured flag and then on views
  const featuredArticle = newsItems.find(item => item.featured) || 
    [...newsItems].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  // [Analysis] Add scroll restoration to preserve user's position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, selectedDate]);

  // [Analysis] Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

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
            <NewsFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onDateChange={setSelectedDate}
              selectedDate={selectedDate}
            />
          </div>
          <div className="lg:col-span-1">
            <NewsApiStatus onRefresh={refresh} />
          </div>
        </div>
        
        <NewsErrorBoundary>
          {featuredArticle && !searchQuery && !selectedDate && !selectedCategory && (
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
            newsItems={searchQuery || selectedDate || selectedCategory ? 
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
        </NewsErrorBoundary>
      </main>
    </div>
  );
};

export default AINews;
