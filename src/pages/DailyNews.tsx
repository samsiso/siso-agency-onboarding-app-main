
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsContent } from '@/components/ai-news/NewsContent';

const DailyNews = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // [Analysis] Parse and validate the date
  const currentDate = date ? parseISO(date) : new Date();
  const formattedDate = format(currentDate, 'yyyy-MM-dd');

  const {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    error
  } = useNewsItems(null, 'published', formattedDate);

  // [Analysis] Check for available dates in a range using a compatible query
  const { data: dateAvailability } = useQuery({
    queryKey: ['news-dates', formattedDate],
    queryFn: async () => {
      const startDate = format(subDays(currentDate, 7), 'yyyy-MM-dd');
      const endDate = format(addDays(currentDate, 7), 'yyyy-MM-dd');
      
      const { data: counts } = await supabase
        .from('ai_news')
        .select('date')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('status', 'published');

      if (!counts) return [];

      // Process the results to get counts by date
      const countsByDate = counts.reduce((acc: { [key: string]: number }, item) => {
        const date = item.date;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format
      return Object.entries(countsByDate).map(([date, count]) => ({
        date,
        count
      }));
    }
  });

  const handleDateChange = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(currentDate, 1)
      : addDays(currentDate, 1);
    navigate(`/ai-news/daily/${format(newDate, 'yyyy-MM-dd')}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Date Navigation */}
          <div className="flex flex-col space-y-6 mb-8">
            <div className="flex items-center justify-between bg-siso-bg-alt p-4 rounded-lg">
              <Button
                variant="outline"
                onClick={() => handleDateChange('prev')}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Day
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-siso-red" />
                <span className="text-xl font-semibold">
                  {format(currentDate, 'MMMM d, yyyy')}
                </span>
                {newsItems.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {newsItems.length} articles
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => handleDateChange('next')}
                disabled={format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
              >
                Next Day
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Date Availability Indicators */}
            <div className="flex items-center justify-center gap-2">
              {dateAvailability?.map((dateInfo) => {
                const isCurrentDate = dateInfo.date === formattedDate;
                return (
                  <Button
                    key={dateInfo.date}
                    variant={isCurrentDate ? "default" : "ghost"}
                    size="sm"
                    className={`px-2 ${isCurrentDate ? 'bg-siso-red' : ''}`}
                    onClick={() => navigate(`/ai-news/daily/${dateInfo.date}`)}
                  >
                    {format(parseISO(dateInfo.date), 'MMM d')}
                    <Badge variant="secondary" className="ml-2">
                      {dateInfo.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          {loading ? (
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
            <NewsContent
              newsItems={newsItems}
              summaries={summaries}
              loadingSummaries={loadingSummaries}
              onGenerateSummary={generateSummary}
              searchQuery=""
              loading={loading}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">No news items found for this date.</p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={() => navigate('/ai-news')}
              >
                Return to Latest News
              </Button>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DailyNews;
