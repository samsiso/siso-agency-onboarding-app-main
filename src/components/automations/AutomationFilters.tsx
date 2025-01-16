import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AutomationCategory } from './types';

interface AutomationFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: AutomationCategory;
  onCategoryChange: (value: AutomationCategory) => void;
  getCategoryCount: (category: AutomationCategory) => number;
}

export function AutomationFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  getCategoryCount
}: AutomationFiltersProps) {
  return (
    <>
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
        <Input
          placeholder="Search automations..."
          className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Tabs defaultValue={selectedCategory} className="w-full" onValueChange={(value) => onCategoryChange(value as AutomationCategory)}>
        <TabsList className="w-full justify-start bg-siso-text/5 border border-siso-text/10 flex-wrap">
          <TabsTrigger value="all" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            All
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('all')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="featured" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            Featured
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('featured')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            LinkedIn
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('linkedin')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            Instagram
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('instagram')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="x" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            X
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('x')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reddit" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            Reddit
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('reddit')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="youtube" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            YouTube
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('youtube')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tiktok" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            TikTok
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('tiktok')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange">
            General
            <Badge variant="secondary" className="ml-2 bg-siso-text/10">
              {getCategoryCount('general')}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
}