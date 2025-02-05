import { Grid, List, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface EducationToolbarProps {
  activeSection: 'videos' | 'educators';
  viewMode: 'grid' | 'list';
  onSectionChange: (section: 'videos' | 'educators') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const EducationToolbar = ({
  activeSection,
  viewMode,
  onSectionChange,
  onViewModeChange
}: EducationToolbarProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <Tabs defaultValue={activeSection} className="w-full md:w-auto">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger 
            value="videos"
            onClick={() => onSectionChange('videos')}
            className="data-[state=active]:bg-siso-orange"
          >
            Videos
          </TabsTrigger>
          <TabsTrigger 
            value="educators"
            onClick={() => onSectionChange('educators')}
            className="data-[state=active]:bg-siso-orange"
          >
            Educators
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewModeChange('grid')}
                className={viewMode === 'grid' ? 'text-siso-orange' : 'text-siso-text/50'}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grid View</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewModeChange('list')}
                className={viewMode === 'list' ? 'text-siso-orange' : 'text-siso-text/50'}
              >
                <List className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>List View</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sort</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};