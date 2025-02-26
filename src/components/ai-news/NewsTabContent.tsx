
import { motion } from 'framer-motion';
import { lazy, memo, useState, useMemo } from 'react';
import { Calendar, Grid3X3, LayoutList, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsItem } from '@/types/blog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'; 
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const NewsCard = lazy(() => import('@/components/ai-news/NewsCard'));

interface NewsTabContentProps {
  items: NewsItem[]; // [Analysis] Explicitly typed as NewsItem array to avoid unknown type
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
}

// [Analysis] Added stagger effect for smoother content transitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      duration: 0.3
    }
  }
};

// [Analysis] Individual item animations for consistent transitions
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// [Analysis] Memoized component to prevent unnecessary re-renders
export const NewsTabContent = memo(({
  items,
  summaries,
  loadingSummaries,
  onGenerateSummary
}: NewsTabContentProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dateGrouping, setDateGrouping] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    impact: [] as string[],
    complexity: [] as string[]
  });

  // [Analysis] Filter items based on selected filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // If no filters are applied in a category, include all items
      const categoryMatch = filters.categories.length === 0 || 
        filters.categories.includes(item.category);
      
      const impactMatch = filters.impact.length === 0 || 
        filters.impact.includes(item.impact);
      
      const complexityMatch = filters.complexity.length === 0 || 
        filters.complexity.includes(item.technical_complexity);
      
      return categoryMatch && impactMatch && complexityMatch;
    });
  }, [items, filters]);

  // [Analysis] Group articles by date for better organization when date grouping is enabled
  const groupedByDate = useMemo(() => {
    if (!dateGrouping) return {};
    
    return filteredItems.reduce((groups, item) => {
      const date = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {} as Record<string, NewsItem[]>);
  }, [filteredItems, dateGrouping]);

  // [Analysis] Sort dates in reverse chronological order
  const sortedDates = useMemo(() => {
    return Object.keys(groupedByDate).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedByDate]);

  // [Analysis] Extract unique categories, impact levels, and complexity levels for filters
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const impactLevels = new Set<string>();
    const complexityLevels = new Set<string>();
    
    items.forEach(item => {
      if (item.category) categories.add(item.category);
      if (item.impact) impactLevels.add(item.impact);
      if (item.technical_complexity) complexityLevels.add(item.technical_complexity);
    });
    
    return {
      categories: Array.from(categories),
      impact: Array.from(impactLevels),
      complexity: Array.from(complexityLevels)
    };
  }, [items]);

  // [Analysis] Handle filter changes
  const handleFilterChange = (type: 'categories' | 'impact' | 'complexity', value: string) => {
    setFilters(prev => {
      const current = [...prev[type]];
      if (current.includes(value)) {
        return {
          ...prev,
          [type]: current.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [type]: [...current, value]
        };
      }
    });
  };

  // [Analysis] Determine the grid columns based on view mode
  const gridClass = viewMode === 'grid' 
    ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 auto-rows-[minmax(300px,auto)]"
    : "flex flex-col gap-4";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={dateGrouping ? "default" : "outline"}
            size="sm"
            onClick={() => setDateGrouping(!dateGrouping)}
            className="h-8"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Group by Date
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.categories.length > 0 || filters.impact.length > 0 || filters.complexity.length > 0) && (
                  <span className="ml-1 bg-siso-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {filters.categories.length + filters.impact.length + filters.complexity.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                {filterOptions.categories.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Category</h4>
                    <div className="space-y-2">
                      {filterOptions.categories.map(category => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={filters.categories.includes(category)}
                            onCheckedChange={() => handleFilterChange('categories', category)}
                          />
                          <Label htmlFor={`category-${category}`} className="capitalize">
                            {category.replace(/_/g, ' ')}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {filterOptions.impact.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Impact Level</h4>
                    <div className="space-y-2">
                      {filterOptions.impact.map(impact => (
                        <div key={impact} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`impact-${impact}`} 
                            checked={filters.impact.includes(impact)}
                            onCheckedChange={() => handleFilterChange('impact', impact)}
                          />
                          <Label htmlFor={`impact-${impact}`} className="capitalize">{impact}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {filterOptions.complexity.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Technical Complexity</h4>
                    <div className="space-y-2">
                      {filterOptions.complexity.map(complexity => (
                        <div key={complexity} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`complexity-${complexity}`} 
                            checked={filters.complexity.includes(complexity)}
                            onCheckedChange={() => handleFilterChange('complexity', complexity)}
                          />
                          <Label htmlFor={`complexity-${complexity}`} className="capitalize">{complexity}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {(filters.categories.length > 0 || filters.impact.length > 0 || filters.complexity.length > 0) && (
                <div className="flex justify-end border-t mt-4 pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setFilters({ categories: [], impact: [], complexity: [] })}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
          
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {dateGrouping && sortedDates.length > 0 ? (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <motion.div
              key={date}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-siso-red" />
                {date}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({groupedByDate[date].length} article{groupedByDate[date].length !== 1 ? 's' : ''})
                </span>
              </h3>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className={gridClass}
              >
                {groupedByDate[date].map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="group h-full min-h-[300px] flex"
                  >
                    <NewsCard
                      item={item}
                      summaries={summaries}
                      loadingSummaries={loadingSummaries}
                      onGenerateSummary={onGenerateSummary}
                      isCompact={viewMode === 'list'}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={gridClass}
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group h-full min-h-[300px] flex"
            >
              <NewsCard
                item={item}
                summaries={summaries}
                loadingSummaries={loadingSummaries}
                onGenerateSummary={onGenerateSummary}
                isCompact={viewMode === 'list'}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="bg-muted rounded-full p-3">
            <Filter className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No matching articles</h3>
          <p className="text-muted-foreground max-w-md">
            {items.length > 0
              ? "Try adjusting your filters to see more results."
              : "There are no articles available at this time."}
          </p>
          {(filters.categories.length > 0 || filters.impact.length > 0 || filters.complexity.length > 0) && (
            <Button 
              variant="outline" 
              onClick={() => setFilters({ categories: [], impact: [], complexity: [] })}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
});

NewsTabContent.displayName = 'NewsTabContent';
