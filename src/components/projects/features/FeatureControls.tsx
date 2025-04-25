
import React from 'react';
import { Filter, SortAsc, RefreshCw, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { FeatureFilter, SortOption } from '@/types/feature.types';

interface FeatureControlsProps {
  filter: FeatureFilter;
  setFilter: (filter: FeatureFilter) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onRetry?: () => void;
  isLoading?: boolean;
  hasError?: boolean;
}

export function FeatureControls({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  onRetry,
  isLoading,
  hasError
}: FeatureControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as FeatureFilter)} className="mr-2">
        <TabsList className="bg-black/40">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-wrap gap-3 ml-auto">
        {/* Priority filter dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 text-siso-text">
              <ListFilter className="h-4 w-4" />
              Priority
              {filter === 'high_priority' && <span className="ml-1 px-1.5 py-0.5 bg-black/30 text-xs rounded-full">High</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter By Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup 
              value={filter === 'high_priority' ? 'high_priority' : 'all_priority'}
              onValueChange={(value) => {
                if (value === 'high_priority') {
                  setFilter('high_priority');
                } else if (filter === 'high_priority') {
                  // If we're deselecting high_priority, go back to all
                  setFilter('all');
                }
              }}
            >
              <DropdownMenuRadioItem value="all_priority">All Priorities</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="high_priority">High Priority Only</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 text-siso-text">
              <SortAsc className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <DropdownMenuRadioItem value="priority">Priority</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="difficulty">Difficulty</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cost">Cost (High to Low)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title">Name (A-Z)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Retry button - only show when there's an error */}
        {hasError && onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            disabled={isLoading}
            className="gap-1 text-siso-text"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
