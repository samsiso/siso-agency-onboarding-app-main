
import React from 'react';
import { Filter, SortAsc, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <div className="flex flex-wrap gap-3">
      {/* Filter dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 text-siso-text">
            <Filter className="h-4 w-4" />
            Filter
            {filter !== 'all' && <span className="ml-1 px-1.5 py-0.5 bg-black/30 text-xs rounded-full">1</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Filter Features</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={filter} onValueChange={(value) => setFilter(value as FeatureFilter)}>
            <DropdownMenuRadioItem value="all">All Features</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="in_progress">In Progress</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="high_priority">High Priority</DropdownMenuRadioItem>
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
        <DropdownMenuContent align="start">
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
  );
}
