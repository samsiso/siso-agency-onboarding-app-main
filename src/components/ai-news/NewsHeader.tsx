
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewsSearchSection } from './NewsSearchSection';

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
    <div className="space-y-4 mb-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
          Latest AI News
        </h1>
        <p className="text-siso-text/80 text-sm sm:text-base">
          Stay updated with the latest breakthroughs and news in AI technology
        </p>
      </div>

      <NewsSearchSection 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      
      <div className="flex flex-wrap gap-2 sm:gap-4">
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
  );
};

export default NewsHeader;
