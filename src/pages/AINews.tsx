import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format, startOfWeek, startOfMonth, endOfWeek, endOfMonth, parseISO } from 'date-fns';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsHeader } from '@/components/ai-news/NewsHeader';
import { NewsContent } from '@/components/ai-news/NewsContent';
// Corrected imports for default exports
import NewsFilters from '@/components/ai-news/NewsFilters';
import NewsCategories from '@/components/ai-news/NewsCategories';
import NewsPagination from '@/components/ai-news/NewsPagination';
import { NewsDateSection } from '@/components/ai-news/NewsDateSection';
import { NewsApiStatus } from '@/components/ai-news/NewsApiStatus';
import { AdminControls } from '@/components/ai-news/AdminControls';
import { DailyStatsOverview } from '@/components/ai-news/DailyStatsOverview';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { DateNavigation } from '@/components/ai-news/DateNavigation';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/assistants/layout/MainLayout';

// [Analysis] Enhanced UI to handle different time ranges for news viewing
const AINews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Hide admin panel by default
  const [currentRange, setCurrentRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Using the enhanced useNewsItems hook with a clearly defined selected date
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
    goToDate,
    syncNews,
    syncingNews,
    lastSync,
    articleCount,
    syncResult,
    fetchNewsInRange
  } = useNewsItems(selectedCategory);
  
  console.log('Rendering AINews component with', newsItems.length, 'news items');
  console.log('Current date:', format(currentDate, 'yyyy-MM-dd'));
  console.log('Date range:', dateRange);
  console.log('Loading state:', loading);
  console.log('Current range:', currentRange);
  
  // Update page title 
  useEffect(() => {
    document.title = 'AI News | Daily Updates on AI Technology';
  }, []);
  
  // Reset pagination when tab or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory]);

  // [Analysis] Handle range changes with improved date logic and explicit logging
  useEffect(() => {
    console.log('Current range changed to:', currentRange);
    
    if (currentRange === 'day') {
      // Single day view - use the current date
      console.log('Fetching single day view for:', format(currentDate, 'yyyy-MM-dd'));
      // No need to call fetchNewsInRange for day view, it's handled by the date change
    } else if (currentRange === 'week') {
      // Get the week's start (Sunday) and end (Saturday) for the current date
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      console.log(`Week range: ${format(weekStart, 'yyyy-MM-dd')} to ${format(weekEnd, 'yyyy-MM-dd')}`);
      fetchNewsInRange(weekStart, weekEnd);
    } else if (currentRange === 'month') {
      // Get the month's start (1st) and end (28th-31st) for the current date
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      console.log(`Month range: ${format(monthStart, 'yyyy-MM-dd')} to ${format(monthEnd, 'yyyy-MM-dd')}`);
      fetchNewsInRange(monthStart, monthEnd);
    }
  }, [currentRange, currentDate, fetchNewsInRange, selectedCategory]);
  
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
  
  // Toggle admin panel visibility
  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
  };
  
  // [Analysis] Improved range selection handler with logging
  const handleRangeSelect = (range: 'day' | 'week' | 'month') => {
    console.log('Range selection changed from', currentRange, 'to', range);
    setCurrentRange(range);
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
  
  // [Analysis] Completely refactored to fix the type instantiation issue
  const analyzeArticle = async (articleId: string): Promise<void> => {
    try {
      // Find the article details
      const article = newsItems.find(item => item.id === articleId);
      if (!article) {
        toast.error('Article not found');
        return;
      }

      // Call the edge function to analyze the article with proper error handling
      const response = await supabase.functions.invoke('analyze-article', {
        body: { 
          articleId,
          title: article.title,
          content: article.content || article.description || '',
          source: article.source,
          category: article.category
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      toast.success('Article analyzed successfully');
      
    } catch (error) {
      console.error('Error analyzing article:', error);
      toast.error('Failed to analyze article');
    }
  };
  
  return (
    <MainLayout>
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
              onToggleAdminPanel={toggleAdminPanel}
              showAdminPanel={showAdminPanel}
            />
            
            {/* Date navigation - passing explicit date-related props */}
            <DateNavigation 
              currentDate={currentDate}
              dateRange={dateRange}
              onNextDay={goToNextDay}
              onPreviousDay={goToPreviousDay}
              onSelectDate={goToDate}
              onSelectRange={handleRangeSelect}
              currentRange={currentRange}
              loading={loading}
            />
            
            {/* Daily statistics overview */}
            <DailyStatsOverview 
              newsItems={newsItems} 
              loading={loading}
            />
            
            {/* Improved category filters with enhanced UI */}
            <div className="space-y-6">
              <NewsFilters 
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategorySelect}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
              />
            </div>
            
            {/* Admin panel for testing and managing news sync - only shown when toggled */}
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
            
            {/* Main news content with added AI analysis capability */}
            <NewsContent 
              newsItems={newsItems}
              searchQuery={searchQuery}
              summaries={summaries}
              loadingSummaries={loadingSummaries}
              onGenerateSummary={generateSummary}
              onAnalyzeArticle={analyzeArticle}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
            />
            
            {/* Pagination */}
            <NewsPagination 
              currentPage={currentPage}
              totalPages={Math.ceil(newsItems.length / 10)}
              onPageChange={setCurrentPage}
            />
            
            {/* API status indicator for transparency */}
            <NewsApiStatus
              apiUsage={articleCount > 0 ? (articleCount / 10000) * 100 : 0}
              lastSync={lastSync}
              articleCount={articleCount}
              syncingNews={syncingNews}
            />
          </motion.div>
        </NewsErrorBoundary>
      </div>
    </MainLayout>
  );
};

export default AINews;
