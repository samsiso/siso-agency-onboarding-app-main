
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useState, useCallback } from 'react';
import NewsCategories from './NewsCategories';
import { debounce } from '@/lib/utils';

interface NewsFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onDateChange?: (date: string | null) => void;
  selectedDate?: string | null;
}

// [Analysis] Animation variants for filter components to enhance UX
const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const NewsFilters = ({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onDateChange,
  selectedDate
}: NewsFiltersProps) => {
  const [dateFilter, setDateFilter] = useState<string>(selectedDate || '');
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // [Analysis] Use debounce to prevent too many search requests
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 350),
    [onSearchChange]
  );
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleDateSubmit = () => {
    if (onDateChange) {
      onDateChange(dateFilter || null);
    }
  };

  const clearDateFilter = () => {
    setDateFilter('');
    if (onDateChange) {
      onDateChange(null);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      className="space-y-4 mb-6"
    >
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full"
      >
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search AI news..."
            value={inputValue}
            onChange={handleSearchChange}
            className="pl-10 bg-background"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {onDateChange && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Calendar className="h-4 w-4 mr-2" />
                  {selectedDate ? 'Date: ' + selectedDate : 'Filter by Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter by Date</h4>
                  <div className="space-y-2">
                    <Label htmlFor="date-filter">Date (YYYY-MM-DD)</Label>
                    <Input
                      id="date-filter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearDateFilter}
                    >
                      Clear
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={handleDateSubmit}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <NewsCategories 
          selectedCategory={selectedCategory} 
          onCategoryChange={onCategoryChange} 
        />
      </motion.div>
    </motion.div>
  );
};

export default NewsFilters;
