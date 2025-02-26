
import { TrendingUp, Clock, MessageSquare, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsTabContent } from './NewsTabContent';
import { memo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import NewsCard from './NewsCard';
import { TableOfContents } from './TableOfContents';

interface NewsTabsProps {
  latestItems: any[];
  trendingItems: any[];
  mostDiscussedItems: any[];
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
}

const NewsTabs = memo(({
  latestItems,
  trendingItems,
  mostDiscussedItems,
  summaries,
  loadingSummaries,
  onGenerateSummary
}: NewsTabsProps) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [activeId, setActiveId] = useState<string>();
  
  const weekStart = startOfWeek(subWeeks(new Date(), currentWeekOffset));
  const weekEnd = endOfWeek(weekStart);
  
  const filterItemsByDateRange = (items: any[]) => {
    return items.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= weekStart && itemDate <= weekEnd;
    });
  };

  const dailyBriefs = latestItems.filter(item => item.template_type === 'daily_brief');
  const filteredDailyBriefs = filterItemsByDateRange(dailyBriefs);
  const otherNews = latestItems.filter(item => item.template_type !== 'daily_brief');

  // [Analysis] Handler to ensure correct function signature propagation
  const handleGenerateSummary = (id: string) => {
    onGenerateSummary(id);
  };

  // [Analysis] Track which section is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    filteredDailyBriefs.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [filteredDailyBriefs]);

  return (
    <Tabs defaultValue="latest" className="w-full">
      <TabsList className="grid w-full lg:w-[600px] grid-cols-4">
        <TabsTrigger value="daily" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Daily Briefs
        </TabsTrigger>
        <TabsTrigger value="latest" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Latest
        </TabsTrigger>
        <TabsTrigger value="trending" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Trending
        </TabsTrigger>
        <TabsTrigger value="discussed" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Most Discussed
        </TabsTrigger>
      </TabsList>

      <TabsContent value="daily" className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
            >
              Previous Week
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentWeekOffset(prev => Math.max(0, prev - 1))}
              disabled={currentWeekOffset === 0}
            >
              Next Week
            </Button>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-4">
              {filteredDailyBriefs.map((item) => (
                <div key={item.id} id={item.id}>
                  <NewsCard
                    item={item}
                    summaries={summaries}
                    loadingSummaries={loadingSummaries}
                    onGenerateSummary={handleGenerateSummary}
                    isCompact={true}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-80 hidden xl:block">
            <TableOfContents
              items={filteredDailyBriefs}
              activeId={activeId}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="latest" className="mt-6">
        <NewsTabContent 
          items={otherNews}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={handleGenerateSummary}
        />
      </TabsContent>

      <TabsContent value="trending" className="mt-6">
        <NewsTabContent 
          items={trendingItems}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={handleGenerateSummary}
        />
      </TabsContent>

      <TabsContent value="discussed" className="mt-6">
        <NewsTabContent 
          items={mostDiscussedItems}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={handleGenerateSummary}
        />
      </TabsContent>
    </Tabs>
  );
});

NewsTabs.displayName = 'NewsTabs';

export default NewsTabs;
