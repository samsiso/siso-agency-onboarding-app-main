
import { TrendingUp, Clock, MessageSquare, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { TableOfContents } from './TableOfContents';

// [Analysis] Updated interface to match props being passed from NewsContent
export interface NewsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const NewsTabs = memo(({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory
}: NewsTabsProps) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [activeId, setActiveId] = useState<string>();
  
  const weekStart = startOfWeek(subWeeks(new Date(), currentWeekOffset));
  const weekEnd = endOfWeek(weekStart);
  
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

    // This will be connected to actual daily brief elements when they're rendered
    const elements = document.querySelectorAll('[data-daily-brief="true"]');
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {/* The actual daily brief content will be rendered by NewsContent */}
            <p className="text-muted-foreground">Select a daily brief to view its contents.</p>
          </div>
          <div className="w-80 hidden xl:block">
            <TableOfContents
              items={[]} // This will be populated when we have actual daily briefs
              activeId={activeId}
            />
          </div>
        </div>
      </TabsContent>

      {/* The content for the other tabs will be rendered by NewsContent */}
      <TabsContent value="latest" className="mt-6" />
      <TabsContent value="trending" className="mt-6" />
      <TabsContent value="discussed" className="mt-6" />
    </Tabs>
  );
});

NewsTabs.displayName = 'NewsTabs';

export default NewsTabs;
