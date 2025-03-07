
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NewsSearchSection } from './NewsSearchSection';
import { RefreshCw, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NewsItem } from '@/types/blog';

interface NewsHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  title?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  syncingNews?: boolean;
  syncNews?: () => Promise<any>;
  lastSyncInfo?: string;
  articleCount?: number;
}

// [Analysis] Enhanced header component with more feedback on article generation process
export function NewsHeader({
  activeTab,
  onTabChange,
  title = "AI News Dashboard",
  searchQuery = '',
  onSearchChange = () => {},
  syncingNews = false,
  syncNews = async () => ({}),
  lastSyncInfo = '',
  articleCount = 0
}: NewsHeaderProps) {
  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    }
  };
  
  return <div className="space-y-6 mb-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">
            Latest updates and breakthroughs in AI technology
          </p>
        </div>
        
        {lastSyncInfo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-help">
                    <Info className="h-4 w-4" />
                    <span>Last sync: {lastSyncInfo}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total articles in database: {articleCount}</p>
                  <p>Articles are generated using the mock generator in the edge function</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={syncNews}
              disabled={syncingNews}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${syncingNews ? 'animate-spin' : ''}`} />
              {syncingNews ? 'Syncing...' : 'Sync News'}
            </Button>
          </div>
        )}
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
          <NewsSearchSection searchQuery={searchQuery} onSearchChange={handleSearchChange} />
        </div>
      </div>
    </div>;
}
