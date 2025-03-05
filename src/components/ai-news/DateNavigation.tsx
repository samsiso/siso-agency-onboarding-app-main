
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, isToday, isSameDay, parseISO } from "date-fns";
import { motion } from "framer-motion";

interface DateNavigationProps {
  currentDate: Date;
  dateRange: string[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onSelectDate: (date: Date) => void;
  loading?: boolean;
}

export const DateNavigation = ({
  currentDate,
  dateRange,
  onPreviousDay,
  onNextDay,
  onSelectDate,
  loading = false
}: DateNavigationProps) => {
  // [Analysis] Animate date changes
  const dateVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
  };

  // [Analysis] Debug the date range
  console.log('Date range:', dateRange);
  console.log('Loading state:', loading);

  const handleSelectDateFromCalendar = (date: Date | undefined) => {
    if (date) {
      onSelectDate(date);
    }
  };

  const handleSelectDateFromDropdown = (dateString: string) => {
    const date = parseISO(dateString);
    onSelectDate(date);
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
          <span className="sr-only">Previous day</span>
        </Button>

        <div className="flex flex-col items-center">
          <motion.div
            key={displayDate.toISOString()}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={dateVariants}
            className="flex items-center gap-2"
          >
            <span className="text-lg font-semibold">
              {isToday(displayDate) ? 'Today' : format(displayDate, 'EEEE')}
            </span>
            <Badge variant="outline" className="bg-siso-red/10 text-siso-red border-siso-red/20">
              {format(displayDate, 'MMMM d, yyyy')}
            </Badge>
          </motion.div>
          
          <span className="text-xs text-gray-400 mt-1">
            Showing articles published on this date
          </span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextDay}
          disabled={loading || isToday(displayDate)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next day</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
                  // Only disable future dates beyond today, allow all past dates
                  return date > today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {dateRange.length > 0 && (
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
        
        {isToday(displayDate) && (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            Latest News
          </Badge>
        )}
      </div>
    </div>
  );
};
