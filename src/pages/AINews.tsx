
import { useState, Suspense, lazy } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsContent } from '@/components/ai-news/NewsContent';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Lazy load components for better initial load performance
const NewsHeader = lazy(() => import('@/components/ai-news/NewsHeader'));
const NewsCategories = lazy(() => import('@/components/ai-news/NewsCategories'));
const NewsTabs = lazy(() => import('@/components/ai-news/NewsTabs').then(module => ({ default: module.NewsTabs })));
const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

// [Analysis] Reusable loading components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
  </div>
);

// [Analysis] Animation variants for smooth transitions
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
  const [postStatus, setPostStatus] = useState<'all' | 'draft' | 'published'>('published');
  const { toast } = useToast();
  
  const {
    newsItems: posts,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    hasMore,
    loadMore,
    error
  } = useNewsItems(selectedCategory, postStatus);

  // [Analysis] Extract featured articles for hero section
  const featuredArticles = posts.filter(post => post.impact === 'high').slice(0, 3);
  const regularArticles = posts.filter(post => post.impact !== 'high');

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading posts",
      description: "Failed to load blog posts. Please try again.",
    });
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <NewsErrorBoundary>
          <div className="flex flex-1 h-screen bg-background">
            <Sidebar />
            <main className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-full"
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <NewsHeader
                      selectedMonth={selectedMonth}
                      selectedYear={selectedYear}
                      onMonthChange={setSelectedMonth}
                      onYearChange={setSelectedYear}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      postStatus={postStatus}
                      onPostStatusChange={setPostStatus}
                    />

                    <NewsCategories
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                    />

                    {/* Featured Articles Section */}
                    {featuredArticles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                      >
                        {featuredArticles.map((article, index) => (
                          <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={index === 0 ? "lg:col-span-2" : ""}
                          >
                            <Suspense fallback={<LoadingSpinner />}>
                              <NewsCard
                                item={article}
                                summaries={summaries}
                                loadingSummaries={loadingSummaries}
                                onGenerateSummary={generateSummary}
                                isFeatured={true}
                              />
                            </Suspense>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {/* Regular Articles Tabs */}
                    <NewsTabs
                      latestItems={regularArticles}
                      trendingItems={regularArticles.sort((a, b) => (b.views || 0) - (a.views || 0))}
                      mostDiscussedItems={regularArticles.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0))}
                      summaries={summaries}
                      loadingSummaries={loadingSummaries}
                      onGenerateSummary={generateSummary}
                    />

                    {/* Load More Section */}
                    {hasMore && !loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center py-8"
                      >
                        <button
                          onClick={loadMore}
                          className="px-6 py-3 bg-siso-red/10 text-siso-red rounded-lg hover:bg-siso-red/20 transition-colors"
                        >
                          Load More Articles
                        </button>
                      </motion.div>
                    )}

                    {loading && <LoadingSpinner />}
                  </Suspense>
                </motion.div>
              </div>
            </main>
          </div>
        </NewsErrorBoundary>
      </div>
    </SidebarProvider>
  );
};

export default AINews;
