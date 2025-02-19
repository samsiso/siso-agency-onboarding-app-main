import { useState, Suspense, lazy } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsContent } from '@/components/ai-news/NewsContent';
import { NewsErrorBoundary } from '@/components/ai-news/NewsErrorBoundary';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { format, subDays, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const NewsHeader = lazy(() => import('@/components/ai-news/NewsHeader'));
const NewsCategories = lazy(() => import('@/components/ai-news/NewsCategories'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-6 w-6 animate-spin text-siso-red" />
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
  const [postStatus, setPostStatus] = useState<'all' | 'draft' | 'published'>('published');
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  // [Analysis] Get today's date for filtering
  const today = new Date();
  const todayPosts = posts.filter(post => 
    new Date(post.date).toDateString() === today.toDateString()
  );

  // [Analysis] Separate daily briefs from regular posts using article_type
  const dailyBriefs = todayPosts.filter(post => post.article_type === 'daily_brief');
  const featuredDailyBrief = dailyBriefs[0]; // Most recent daily brief

  // [Analysis] Group remaining posts by category with proper typing
  const categorizedPosts = todayPosts.reduce<Record<string, typeof posts>>((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date();
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1)
      : addDays(currentDate, 1);
    navigate(`/ai-news/daily/${format(newDate, 'yyyy-MM-dd')}`);
  };

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

                    {/* Date Navigation */}
                    <div className="flex items-center justify-between mb-8 bg-siso-bg-alt p-4 rounded-lg">
                      <Button
                        variant="outline"
                        onClick={() => handleDateChange('prev')}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous Day
                      </Button>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-siso-red" />
                        <span className="text-lg font-semibold">
                          {format(today, 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDateChange('next')}
                      >
                        Next Day
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>

                    {/* Featured Daily Brief */}
                    {featuredDailyBrief && (
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 text-siso-text">Today's AI Briefing</h2>
                        <div className="bg-gradient-to-r from-siso-red/10 to-siso-orange/10 p-6 rounded-lg">
                          <NewsContent
                            newsItems={[featuredDailyBrief]}
                            summaries={summaries}
                            loadingSummaries={loadingSummaries}
                            onGenerateSummary={generateSummary}
                            searchQuery={searchQuery}
                            loading={loading}
                            hasMore={false}
                          />
                        </div>
                      </div>
                    )}

                    {/* Categorized News Sections */}
                    {Object.entries(categorizedPosts).map(([category, items]) => (
                      <div key={category} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-siso-text capitalize">
                          {category.replace('_', ' ')}
                        </h2>
                        <div className="bg-siso-bg-alt/50 p-6 rounded-lg">
                          <NewsContent
                            newsItems={items}
                            summaries={summaries}
                            loadingSummaries={loadingSummaries}
                            onGenerateSummary={generateSummary}
                            searchQuery={searchQuery}
                            loading={loading}
                            hasMore={false}
                          />
                        </div>
                      </div>
                    ))}

                    <NewsCategories
                      selectedCategory={selectedCategory}
                      onCategoryChange={setSelectedCategory}
                    />

                    {/* All News Articles */}
                    <div className="mt-8">
                      <h2 className="text-xl font-semibold mb-4 text-siso-text">Browse All AI News</h2>
                      <NewsContent
                        newsItems={posts}
                        summaries={summaries}
                        loadingSummaries={loadingSummaries}
                        onGenerateSummary={generateSummary}
                        searchQuery={searchQuery}
                        loading={loading}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                      />
                    </div>

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
