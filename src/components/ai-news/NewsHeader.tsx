
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsSearchSection } from './NewsSearchSection';
import { motion } from 'framer-motion';

interface NewsHeaderProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const NewsHeader = ({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange,
  searchQuery,
  onSearchChange
}: NewsHeaderProps) => {
  return (
    <div className="sticky top-0 z-50 bg-gradient-to-b from-background via-background to-background/80 backdrop-blur-sm pb-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-siso-red via-siso-orange to-siso-red bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
          >
            Latest AI News
          </motion.h1>
          <p className="text-siso-text/80 text-sm sm:text-base max-w-2xl">
            Stay updated with the latest breakthroughs and developments in artificial intelligence. 
            Our curated news feed brings you the most important AI updates from around the world.
          </p>
        </div>

        <NewsSearchSection 
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-siso-bg-alt/50 p-2 rounded-lg border border-siso-border">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-[120px] h-9 sm:h-10 bg-siso-bg-alt border-siso-border">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="03">March</SelectItem>
                <SelectItem value="02">February</SelectItem>
                <SelectItem value="01">January</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="w-[120px] h-9 sm:h-10 bg-siso-bg-alt border-siso-border">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsHeader;
