import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NewsSearchSection } from './NewsSearchSection';
import { RefreshCw } from 'lucide-react';
import { NewsItem } from '@/types/blog';
interface NewsHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  title?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  syncingNews?: boolean;
  syncNews?: () => Promise<any>;
}

// [Analysis] Simplified header component with focused functionality
export function NewsHeader({
  activeTab,
  onTabChange,
  title = "AI News Dashboard",
  searchQuery = '',
  onSearchChange = () => {},
  syncingNews = false,
  syncNews = async () => ({})
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