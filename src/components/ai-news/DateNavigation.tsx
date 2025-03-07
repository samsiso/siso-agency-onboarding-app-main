
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, isToday, isSameDay, parseISO, startOfWeek, startOfMonth, endOfWeek, endOfMonth, isWithinInterval } from "date-fns";
import { motion } from "framer-motion";

interface DateNavigationProps {
  currentDate: Date;
  dateRange: string[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onSelectDate: (date: Date) => void;
  onSelectRange: (range: 'day' | 'week' | 'month') => void;
  currentRange: 'day' | 'week' | 'month';
  loading?: boolean;
}

// [Analysis] Enhanced DateNavigation component with better range selection handling
export const DateNavigation = ({
  currentDate,
  dateRange = [],
  onPreviousDay,
  onNextDay,
  onSelectDate,
  onSelectRange,
  currentRange = 'day',
  loading = false
}: DateNavigationProps) => {
  // [Analysis] Animate date changes for better UX
  const dateVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  // [Analysis] Handle date selection from calendar with proper feedback
  const handleSelectDateFromCalendar = (date: Date | undefined) => {
    if (date) {
      // If we're not in day mode, switch to day mode when selecting a specific date
      if (currentRange !== 'day') {
        onSelectRange('day');
      }
      onSelectDate(date);
    }
  };

  // [Analysis] Handle date selection from dropdown with proper feedback
  const handleSelectDateFromDropdown = (dateString: string) => {
    // If we're not in day mode, switch to day mode when selecting a specific date
    if (currentRange !== 'day') {
      onSelectRange('day');
    }
    const date = parseISO(dateString);
    onSelectDate(date);
  };

  // [Analysis] Handle range selection with improved feedback
  const handleRangeChange = (value: string) => {
    console.log('Range changed to:', value);
    onSelectRange(value as 'day' | 'week' | 'month');
  };

  // [Analysis] Get range text based on current selection with better formatting
  const getRangeText = () => {
    if (currentRange === 'day') {
      return isToday(currentDate) ? 'Today' : format(currentDate, 'EEEE');
    } else if (currentRange === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else if (currentRange === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return `${format(monthStart, 'MMMM d')} - ${format(monthEnd, 'MMMM d, yyyy')}`;
    }
    return '';
  };

  // Use today's date as a default if no date is available
  const today = new Date();
  const displayDate = currentDate || today;

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <div className="flex items-center justify-between bg-gray-900/30 p-3 rounded-md border border-gray-800">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousDay}
          disabled={loading}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous {currentRange}</span>
        </Button>

        <div className="flex flex-col items-center">
          <motion.div
            key={`${currentRange}-${displayDate.toISOString()}`}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={dateVariants}
            className="flex items-center gap-2"
          >
            <span className="text-lg font-semibold">
              {getRangeText()}
            </span>
            <Badge variant="outline" className="bg-siso-red/10 text-siso-red border-siso-red/20">
              {currentRange === 'day' 
                ? format(displayDate, 'MMMM d, yyyy') 
                : currentRange === 'week'
                  ? 'This Week'
                  : 'This Month'}
            </Badge>
          </motion.div>
          
          <span className="text-xs text-gray-400 mt-1">
            Showing articles published {currentRange === 'day' ? 'on this date' : `in this ${currentRange}`}
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextDay}
          disabled={loading || 
            (currentRange === 'day' && isToday(displayDate)) || 
            (currentRange === 'week' && isWithinInterval(today, {
              start: startOfWeek(displayDate),
              end: endOfWeek(displayDate)
            })) ||
            (currentRange === 'month' && isWithinInterval(today, {
              start: startOfMonth(displayDate),
              end: endOfMonth(displayDate)
            }))}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next {currentRange}</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            onValueChange={handleRangeChange}
            value={currentRange}
            disabled={loading}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={loading}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Select Date</span>
                <span className="inline sm:hidden">Calendar</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={displayDate}
                onSelect={handleSelectDateFromCalendar}
                disabled={(date) => {
                  // Only disable future dates beyond today
                  return date > today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {dateRange.length > 0 && currentRange === 'day' && (
            <Select 
              onValueChange={handleSelectDateFromDropdown}
              value={format(displayDate, 'yyyy-MM-dd')}
              disabled={loading}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                {dateRange.map(dateStr => (
                  <SelectItem key={dateStr} value={dateStr}>
                    {isToday(parseISO(dateStr)) 
                      ? 'Today' 
                      : format(parseISO(dateStr), 'MMM d, yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {isToday(displayDate) && currentRange === 'day' && (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            Latest News
          </Badge>
        )}
      </div>
    </div>
  );
};
