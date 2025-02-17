
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { BannerTemplatesDialog } from './blog-layout/BannerTemplatesDialog';

interface NewsHeaderProps {
  selectedMonth: string;
  selectedYear: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  postStatus?: 'all' | 'draft' | 'published';
  onPostStatusChange?: (status: 'all' | 'draft' | 'published') => void;
}

const NewsHeader = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  searchQuery,
  onSearchChange,
  postStatus = 'published',
  onPostStatusChange
}: NewsHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-4">
      <div className="flex flex-1 items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search AI news..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center space-x-4">
        <BannerTemplatesDialog />
      </div>
    </div>
  );
};

export default NewsHeader;
