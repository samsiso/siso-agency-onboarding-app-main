import { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { NewsCategories } from '@/components/ai-news/NewsCategories';

const NewsHeader = lazy(() => import('@/components/ai-news/NewsHeader'));
const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

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
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, [selectedMonth, selectedYear, selectedCategory]);

  const fetchNews = async () => {
    try {
      let query = supabase
        .from('ai_news')
        .select('*')
        .order('date', { ascending: false });

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching news",
          description: error.message,
        });
        return;
      }

      setNewsItems(data || []);

      const { data: summariesData, error: summariesError } = await supabase
        .from('ai_news_summaries')
        .select('news_id, summary');

      if (!summariesError && summariesData) {
        const summariesMap = summariesData.reduce((acc: Record<string, string>, curr) => {
          acc[curr.news_id] = curr.summary;
          return acc;
        }, {});
        setSummaries(summariesMap);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch news items",
      });
    }
  };

  const generateSummary = async (id: string) => {
    if (summaries[id]) return;
    
    setLoadingSummaries(prev => ({ ...prev, [id]: true }));
    const newsItem = newsItems.find(item => item.id === id);
    
    if (!newsItem) {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
      return;
    }

    try {
      const { data: existingSummary, error: fetchError } = await supabase
        .from('ai_news_summaries')
        .select('summary')
        .eq('news_id', id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingSummary) {
        setSummaries(prev => ({ ...prev, [id]: existingSummary.summary }));
        setLoadingSummaries(prev => ({ ...prev, [id]: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { 
          message: `Please provide a brief 2-3 sentence summary of this news: ${newsItem.title}. ${newsItem.description}`,
          systemPrompt: "You are a concise news summarizer. Provide brief, factual summaries."
        },
      });

      if (error) throw error;

      const summary = data.response;

      const { error: insertError } = await supabase
        .from('ai_news_summaries')
        .insert([{ news_id: id, summary }]);

      if (insertError) throw insertError;

      setSummaries(prev => ({ ...prev, [id]: summary }));
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [id]: false }));
    }
  };

  // Split news items into featured, side, and regular posts
  const featuredPost = newsItems[0];
  const sidePosts = newsItems.slice(1, 4);
  const regularPosts = newsItems.slice(4);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-[1600px] mx-auto"
          >
            <Suspense fallback={<LoadingSpinner />}>
              <NewsHeader
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />

              <NewsCategories
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Featured Post - 8 columns on desktop */}
                {featuredPost && (
                  <div className="lg:col-span-8">
                    <NewsCard
                      key={featuredPost.id}
                      item={featuredPost}
                      summaries={summaries}
                      loadingSummaries={loadingSummaries}
                      onGenerateSummary={generateSummary}
                      isFeatured={true}
                    />
                  </div>
                )}

                {/* Side Posts - 4 columns on desktop */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                  {sidePosts.map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      summaries={summaries}
                      loadingSummaries={loadingSummaries}
                      onGenerateSummary={generateSummary}
                    />
                  ))}
                </div>

                {/* Regular Posts - 2 columns grid */}
                {regularPosts.map((item) => (
                  <div key={item.id} className="lg:col-span-6">
                    <NewsCard
                      item={item}
                      summaries={summaries}
                      loadingSummaries={loadingSummaries}
                      onGenerateSummary={generateSummary}
                    />
                  </div>
                ))}
              </div>
            </Suspense>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AINews;