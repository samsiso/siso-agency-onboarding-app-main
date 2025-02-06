import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface DirectoryHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const DirectoryHeader = ({ viewMode, onViewModeChange }: DirectoryHeaderProps) => {
  return (
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
      </TooltipProvider>
    </div>
  );
};
