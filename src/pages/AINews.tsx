
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsHeader } from '@/components/ai-news/NewsHeader';
import { NewsContent } from '@/components/ai-news/NewsContent';
import { NewsFilters } from '@/components/ai-news/NewsFilters';
import { NewsCategories } from '@/components/ai-news/NewsCategories';
import { NewsPagination } from '@/components/ai-news/NewsPagination';
import { NewsDateSection } from '@/components/ai-news/NewsDateSection';
import { NewsApiStatus } from '@/components/ai-news/NewsApiStatus';
import { AdminControls } from '@/components/ai-news/AdminControls';
import { DailyStatsOverview } from '@/components/ai-news/DailyStatsOverview';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { DateNavigation } from '@/components/ai-news/DateNavigation';

// [Analysis] Improved UI to provide more transparency about article generation
const AINews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(true); // Always show admin panel for better transparency
  
  // Using the enhanced useNewsItems hook
  const {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    hasMore,
    loadMore,
    currentDate,
    dateRange,
    goToNextDay,
    goToPreviousDay,
    syncNews,
    syncingNews,
    lastSync,
    articleCount,
    syncResult
  } = useNewsItems(selectedCategory);
  
  console.log('Rendering AINews component with', newsItems.length, 'news items');
  console.log('Current date:', format(currentDate, 'yyyy-MM-dd'));
  console.log('Date range:', dateRange);
  console.log('Loading state:', loading);
  
  // Update page title 
  useEffect(() => {
    document.title = 'AI News | Daily Updates on AI Technology';
  }, []);
  
  // Reset pagination when tab or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory]);
  
  // Handle search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  // Handle manual sync with confirmation
  const handleSyncNews = async () => {
    if (syncingNews) return;
    
    try {
      await syncNews();
      
      toast.success('AI News synced successfully', {
        description: 'Latest AI news has been fetched and added to the database',
      });
    } catch (error) {
      console.error('Error syncing news:', error);
      
      toast.error('Failed to sync AI News', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <NewsErrorBoundary>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Main header and search */}
          <NewsHeader 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            syncingNews={syncingNews}
            syncNews={handleSyncNews}
            lastSyncInfo={lastSync}
            articleCount={articleCount}
          />
          
          {/* Date navigation */}
          <DateNavigation 
            currentDate={currentDate}
            onNextDay={goToNextDay}
            onPreviousDay={goToPreviousDay}
          />
          
          {/* Daily statistics overview */}
          <DailyStatsOverview 
            newsItems={newsItems} 
            loading={loading} 
            date={format(currentDate, 'yyyy-MM-dd')}
          />
          
          {/* Horizontal filter row */}
          <div className="flex flex-wrap items-center gap-4">
            <NewsFilters />
            <NewsCategories 
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
          
          {/* Admin panel for testing and managing news sync */}
          {showAdminPanel && (
            <AdminControls 
              dateRange={dateRange}
              syncNews={syncNews}
              syncingNews={syncingNews}
              syncResult={syncResult}
              apiUsage={articleCount > 0 ? (articleCount / 10000) * 100 : 0}
              lastSync={lastSync}
              articleCount={articleCount}
            />
          )}
          
          {/* Main news content */}
          <NewsContent 
            newsItems={newsItems}
            searchQuery={searchQuery}
            summaries={summaries}
            loadingSummaries={loadingSummaries}
            onGenerateSummary={generateSummary}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
          
          {/* Pagination */}
          <NewsPagination 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            hasMore={hasMore}
          />
          
          {/* API status indicator for transparency */}
          <NewsApiStatus
            apiUsage={articleCount > 0 ? (articleCount / 10000) * 100 : 0}
            lastSync={lastSync}
            articleCount={articleCount}
          />
        </motion.div>
      </NewsErrorBoundary>
    </div>
  );
};

export default AINews;
