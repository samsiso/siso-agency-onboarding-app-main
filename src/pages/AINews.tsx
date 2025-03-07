import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';
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

// [Analysis] Improved UI to provide more transparency about article generation and added AI analysis feature
const AINews: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false); // Hide admin panel by default
  
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
    goToDate,
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
  
  // Toggle admin panel visibility
  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
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
  
  // New function to analyze an article using AI
  const analyzeArticle = async (articleId: string): Promise<void> => {
    try {
      // First check if article already has analysis
      const { data: existingAnalysis, error: checkError } = await supabase
        .from('news_ai_analysis')
        .select('*')
        .eq('article_id', articleId)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      // If analysis exists and is not too old, return it
      if (existingAnalysis) {
        const analysisDate = new Date(existingAnalysis.created_at);
        const now = new Date();
        const hoursSinceAnalysis = (now.getTime() - analysisDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceAnalysis < 24) {
          toast.success('Analysis loaded from cache');
          return;
        }
      }
      
      // Find the article details
      const article = newsItems.find(item => item.id === articleId);
      if (!article) {
        throw new Error('Article not found');
      }
      
      // Call the edge function to analyze the article
      // [Q] Edge function for article analysis needs to be implemented
      const { data, error } = await supabase.functions.invoke('analyze-article', {
        body: { 
          articleId,
          title: article.title,
          content: article.content || article.description || '',
          source: article.source,
          category: article.category
        }
      });
      
      if (error) throw error;
      
      toast.success('Article analyzed successfully');
      
    } catch (error) {
      console.error('Error analyzing article:', error);
      toast.error('Failed to analyze article');
      throw error;
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
            onToggleAdminPanel={toggleAdminPanel}
            showAdminPanel={showAdminPanel}
          />
          
          {/* Date navigation */}
          <DateNavigation 
            currentDate={currentDate}
            dateRange={dateRange}
            onNextDay={goToNextDay}
            onPreviousDay={goToPreviousDay}
            onSelectDate={goToDate}
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
  );
};

export default AINews;
