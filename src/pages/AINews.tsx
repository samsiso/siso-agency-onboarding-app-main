
import { useState, Suspense, lazy } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsContent } from '@/components/ai-news/NewsContent';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { useToast } from '@/hooks/use-toast';

const NewsHeader = lazy(() => import('@/components/ai-news/NewsHeader'));
const NewsCategories = lazy(() => import('@/components/ai-news/NewsCategories'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
  </div>
);

const PageLoadingState = () => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    <main className="flex-1 overflow-hidden">
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-siso-red" />
      </div>
    </main>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const AINews = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('03');
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();
  
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

  // Show error toast if data fetching fails
  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading news",
      description: "Failed to load news items. Please try again.",
    });
  }

  return (
    <SidebarProvider>
      <NewsErrorBoundary>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6 max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6"
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <NewsHeader
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={setSelectedMonth}
                    onYearChange={setSelectedYear}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />

                  <NewsCategories
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />

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
                </Suspense>
              </motion.div>
            </div>
          </main>
        </div>
      </NewsErrorBoundary>
    </SidebarProvider>
  );
};

export default AINews;
