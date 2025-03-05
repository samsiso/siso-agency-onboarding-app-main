
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewsSearchSection } from './NewsSearchSection';
import { Calendar, Search, RefreshCw, Info } from 'lucide-react';
import { DailyStatsOverview } from './DailyStatsOverview';
import { NewsApiStatus } from './NewsApiStatus';
import { FetchHistoryPanel } from './FetchHistoryPanel';
import { useNewsItems } from '@/hooks/useNewsItems';
import { DuplicatesCheckDialog } from './DuplicatesCheckDialog';
import { NewsItem } from '@/types/blog';

interface NewsHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  title?: string;
  showStats?: boolean;
  showApiStatus?: boolean;
  showFetchHistory?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  newsItems?: NewsItem[];
  lastSync?: string | null;
  articleCount?: number;
  apiUsage?: number;
  syncingNews?: boolean;
  activeNewsSource?: 'event_registry' | 'news_api';
  syncNews?: (keyword?: string, limit?: number, source?: 'event_registry' | 'news_api', testOnly?: boolean, skipDuplicates?: boolean) => Promise<any>;
}

export function NewsHeader({
  activeTab,
  onTabChange,
  title = "AI News Dashboard", 
  showStats = true,
  showApiStatus = true,
  showFetchHistory = true,
  searchQuery = '',
  onSearchChange = () => {},
  newsItems = [],
  lastSync = null,
  articleCount = 0,
  apiUsage = 0,
  syncingNews = false,
  activeNewsSource = 'event_registry',
  syncNews = async () => ({})
}: NewsHeaderProps) {
  const [showDuplicatesDialog, setShowDuplicatesDialog] = useState(false);
  
  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    }
  };
  
  const handleTestFetch = async () => {
    try {
      await syncNews("artificial intelligence", 10, activeNewsSource, true);
      setShowDuplicatesDialog(true);
    } catch (error) {
      console.error("Error testing news fetch:", error);
    }
  };
  
  const handleImport = async (skipDuplicates: boolean) => {
    await syncNews("artificial intelligence", 10, activeNewsSource, false, skipDuplicates);
  };
  
  return (
    <div className="space-y-8 mb-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">
            Latest updates and breakthroughs in AI technology
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleTestFetch}
            disabled={syncingNews}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Check for Duplicates</span>
            <span className="inline sm:hidden">Check</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={() => syncNews()}
            disabled={syncingNews}
          >
            <RefreshCw className={`h-4 w-4 ${syncingNews ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync AI News</span>
            <span className="inline sm:hidden">Sync</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="w-full md:w-auto">
          <NewsSearchSection 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
        </div>
      </div>
      
      {/* Conditional rendering for DailyStatsOverview */}
      {showStats && newsItems.length > 0 && (
        <DailyStatsOverview 
          newsItems={newsItems} 
          lastSync={lastSync}
          articleCount={articleCount}
          loading={false}
        />
      )}
      
      {/* Conditional rendering for NewsApiStatus */}
      {showApiStatus && (
        <NewsApiStatus 
          lastSync={lastSync}
          articleCount={articleCount}
          apiUsage={apiUsage}
          syncingNews={syncingNews}
          activeNewsSource={activeNewsSource}
          syncNews={syncNews}
        />
      )}
      
      {/* Conditional rendering for FetchHistoryPanel */}
      {showFetchHistory && (
        <FetchHistoryPanel 
          onRefresh={() => syncNews()} 
          onTestFetch={handleTestFetch}
        />
      )}
      
      {/* Duplicates check dialog */}
      <DuplicatesCheckDialog
        open={showDuplicatesDialog}
        onClose={() => setShowDuplicatesDialog(false)}
        onRefresh={handleTestFetch}
        articles={[]}
        loading={syncingNews}
        onImport={handleImport}
      />
    </div>
  );
}
