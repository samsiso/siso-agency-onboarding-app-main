import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import NewsHeader from '@/components/ai-news/NewsHeader';
import NewsCard from '@/components/ai-news/NewsCard';

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
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, [selectedMonth, selectedYear]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_news')
        .select('*')
        .order('date', { ascending: false });

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

  return (
    <div className="p-4 md:p-6 lg:p-8 max-h-screen overflow-y-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <Suspense fallback={<Skeleton className="w-full h-[200px]" />}>
          <NewsHeader
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />

          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {newsItems.map((item) => (
              <NewsCard
                key={item.id}
                item={item}
                summaries={summaries}
                loadingSummaries={loadingSummaries}
                onGenerateSummary={generateSummary}
              />
            ))}
          </div>
        </Suspense>
      </motion.div>
    </div>
  );
};

export default AINews;