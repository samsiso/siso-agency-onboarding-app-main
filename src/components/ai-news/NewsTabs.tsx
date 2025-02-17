
import { TrendingUp, Clock, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsTabContent } from './NewsTabContent';
import { memo } from 'react';

interface NewsTabsProps {
  latestItems: any[];
  trendingItems: any[];
  mostDiscussedItems: any[];
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
}

export const NewsTabs = memo(({
  latestItems,
  trendingItems,
  mostDiscussedItems,
  summaries,
  loadingSummaries,
  onGenerateSummary
}: NewsTabsProps) => {
  return (
    <Tabs defaultValue="latest" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
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

      <TabsContent value="latest" className="mt-6">
        <NewsTabContent 
          items={latestItems}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={onGenerateSummary}
        />
      </TabsContent>

      <TabsContent value="trending" className="mt-6">
        <NewsTabContent 
          items={trendingItems}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={onGenerateSummary}
        />
      </TabsContent>

      <TabsContent value="discussed" className="mt-6">
        <NewsTabContent 
          items={mostDiscussedItems}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={onGenerateSummary}
        />
      </TabsContent>
    </Tabs>
  );
});

NewsTabs.displayName = 'NewsTabs';
