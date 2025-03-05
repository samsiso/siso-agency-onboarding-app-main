import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, isToday, isSameDay, parseISO } from 'date-fns';
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { NewsDateSection } from '@/components/ai-news/NewsDateSection';
import { NewsEmptyState } from '@/components/ai-news/NewsEmptyState';
import { useNewsItems } from '@/hooks/useNewsItems';
import { NewsItem } from '@/types/blog';
import { FetchHistoryPanel } from '@/components/ai-news/FetchHistoryPanel';
import { FillEmptyDatesPanel } from "@/components/ai-news/FillEmptyDatesPanel";

const AINews = () => {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('published');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const selectedDate = date ? format(date, 'yyyy-MM-dd') : null;

  const {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    initialLoading,
    syncingNews,
    hasMore,
    loadMore,
    totalCount,
    lastSync,
    apiUsage,
    articleCount,
    activeNewsSource,
    switchNewsSource,
    syncResult,
    error,
    currentDate,
    dateRange: availableDates,
    goToNextDay,
    goToPreviousDay,
    goToDate,
    refresh,
    syncNews
  } = useNewsItems(categoryFilter, statusFilter, selectedDate, currentPage, pageSize);

  const handleCategoryChange = (category: string | null) => {
    setCategoryFilter(category);
    setCurrentPage(1); // Reset to the first page when the category changes
  };

  const handleStatusChange = (status: 'all' | 'draft' | 'published') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    setDateRange(undefined);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDate(undefined);
    setDateRange(range);
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setStatusFilter('published');
    setDate(undefined);
    setDateRange(undefined);
    setCurrentPage(1);
  };

  const goToToday = () => {
    goToDate(new Date());
  };

  return (
    <div className="container relative py-10">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">AI News Feed</h1>
          {syncingNews && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button size="sm" onClick={refresh} disabled={syncingNews}>
            Refresh Content
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Category Filter */}
          <div>
            <Label className="block text-sm font-medium leading-none mb-2">Category</Label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={categoryFilter === null ? "default" : "outline"}
                onClick={() => handleCategoryChange(null)}
                className="cursor-pointer"
              >
                All Categories
              </Badge>
              <Badge
                variant={categoryFilter === 'breakthrough_technologies' ? "default" : "outline"}
                onClick={() => handleCategoryChange('breakthrough_technologies')}
                className="cursor-pointer"
              >
                Breakthrough Technologies
              </Badge>
              <Badge
                variant={categoryFilter === 'language_models' ? "default" : "outline"}
                onClick={() => handleCategoryChange('language_models')}
                className="cursor-pointer"
              >
                Language Models
              </Badge>
              <Badge
                variant={categoryFilter === 'robotics_automation' ? "default" : "outline"}
                onClick={() => handleCategoryChange('robotics_automation')}
                className="cursor-pointer"
              >
                Robotics & Automation
              </Badge>
              <Badge
                variant={categoryFilter === 'industry_applications' ? "default" : "outline"}
                onClick={() => handleCategoryChange('industry_applications')}
                className="cursor-pointer"
              >
                Industry Applications
              </Badge>
              <Badge
                variant={categoryFilter === 'international_developments' ? "default" : "outline"}
                onClick={() => handleCategoryChange('international_developments')}
                className="cursor-pointer"
              >
                International Developments
              </Badge>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="block text-sm font-medium leading-none mb-2">Status</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Published
              </Label>
              <Switch id="published" checked={statusFilter === 'published'} onCheckedChange={(checked) => handleStatusChange(checked ? 'published' : 'all')} />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <Label className="block text-sm font-medium leading-none mb-2">Date</Label>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="h-9 w-auto justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : dateRange?.from ? (
                      `${format(dateRange.from, "PPP")} - ${dateRange.to ? format(dateRange.to, "PPP") : "Present"
                      }`
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      availableDates ? !availableDates.includes(format(date, 'yyyy-MM-dd')) : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Date Range Picker */}
          <div>
            <Label className="block text-sm font-medium leading-none mb-2">Date Range</Label>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="h-9 w-auto justify-start text-left font-normal"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      `${format(dateRange.from, "PPP")} - ${dateRange.to ? format(dateRange.to, "PPP") : "Present"
                      }`
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="range"
                    defaultMonth={currentDate}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    disabled={(date) =>
                      availableDates ? !availableDates.includes(format(date, 'yyyy-MM-dd')) : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      <Separator className="mb-4" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="link" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        <div>
          {currentDate && (
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM d, yyyy')}
            </h2>
          )}
        </div>
        <div>
          <Badge variant="secondary">
            {totalCount} Articles
          </Badge>
        </div>
      </div>

      {/* Add FillEmptyDatesPanel next to FetchHistoryPanel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FetchHistoryPanel onRefresh={syncNews} />
        <FillEmptyDatesPanel />
      </div>

      {newsItems.length > 0 ? (
        <NewsDateSection
          date={currentDate}
          items={newsItems}
          summaries={summaries}
          loadingSummaries={loadingSummaries}
          onGenerateSummary={generateSummary}
          loading={loading}
        />
      ) : (
        <NewsEmptyState
          message="No articles found for this date."
          suggestion="Try selecting a different date or syncing new content."
          onRefresh={refresh}
        />
      )}
    </div>
  );
};

export default AINews;
