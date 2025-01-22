import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewsHeaderProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export const NewsHeader = ({ 
  selectedMonth, 
  selectedYear, 
  onMonthChange, 
  onYearChange 
}: NewsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
        Latest AI News
      </h1>
      <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="03">March</SelectItem>
            <SelectItem value="02">February</SelectItem>
            <SelectItem value="01">January</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-[120px]">
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