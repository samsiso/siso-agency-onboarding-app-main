
import { Search, Filter, Calendar, Award } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface LeaderboardFiltersProps {
  onSearchChange: (search: string) => void;
  onPeriodChange: (period: string) => void;
  onCategoryChange: (category: string) => void;
}

export const LeaderboardFilters = ({
  onSearchChange,
  onPeriodChange,
  onCategoryChange,
}: LeaderboardFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10 bg-background/50 border-siso-border"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select
            defaultValue="week"
            onValueChange={onPeriodChange}
          >
            <SelectTrigger className="w-[140px] bg-background/50 border-siso-border">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Award className="h-4 w-4 text-muted-foreground" />
          <Select
            defaultValue="all"
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="w-[140px] bg-background/50 border-siso-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="points">Points</SelectItem>
              <SelectItem value="spending">Spending</SelectItem>
              <SelectItem value="contributions">Contributions</SelectItem>
              <SelectItem value="referrals">Referrals</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          variant="outline" 
          size="icon"
          className="bg-background/50 border-siso-border h-10 w-10"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
