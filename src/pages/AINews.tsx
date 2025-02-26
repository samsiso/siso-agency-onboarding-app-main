
import { useState, useEffect } from 'react';
import NewsHeader from '@/components/ai-news/NewsHeader';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { VideoProcessingTest } from '@/components/VideoProcessingTest'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsContent } from '@/components/ai-news/NewsContent';

export default function AINews() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('latest');

  const {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    hasMore,
    loadMore,
    error
  } = useNewsItems(selectedCategory);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Track page view for analytics
        console.log('AI News page viewed');
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, []);

  return (
    <MainLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="news">AI News</TabsTrigger>
            <TabsTrigger value="videos">Video Processing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-4">
            <NewsHeader
              selectedMonth=""
              selectedYear=""
              onMonthChange={() => {}}
              onYearChange={() => {}}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <NewsErrorBoundary>
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
            </NewsErrorBoundary>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-6">YouTube Video Processing</h2>
              <VideoProcessingTest />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
