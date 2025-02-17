
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { DailyNewsCard } from '@/components/ai-news/daily/DailyNewsCard';
import { Skeleton } from '@/components/ui/skeleton';

// [Analysis] Interface for news items to ensure type safety
interface DailyNewsItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  date: string;
  category: string;
  impact: string;
  technical_complexity: string;
  source: string;
  key_takeaways: string[];
  reading_time: number;
}

const DailyNews = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['daily-news', date],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_news')
        .select('*')
        .eq('date', date)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DailyNewsItem[];
    },
  });

  const handleDateChange = (direction: 'prev' | 'next') => {
    if (!date) return;
    const currentDate = new Date(date);
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1)
      : addDays(currentDate, 1);
    navigate(`/ai-news/daily/${format(newDate, 'yyyy-MM-dd')}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Header Section */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate('/ai-news')}
                className="text-white"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to News
              </Button>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleDateChange('prev')}
                  className="text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Day
                </Button>
                <h2 className="text-xl font-semibold text-white">
                  {date && format(new Date(date), 'MMMM d, yyyy')}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => handleDateChange('next')}
                  className="text-white"
                >
                  Next Day
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : newsItems?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <DailyNewsCard key={item.id} article={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">No news items found for this date.</p>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DailyNews;
