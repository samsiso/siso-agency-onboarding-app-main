
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Filter, Search, Timer } from "lucide-react";

interface LeaderboardFiltersProps {
  onPeriodChange: (period: string) => void;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: string) => void;
}

export const LeaderboardFilters = ({
  onPeriodChange,
  onSearchChange,
  onCategoryChange
}: LeaderboardFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-siso-text/50" />
          <Input
            placeholder="Search players..."
            className="pl-9 bg-black/20 border-siso-border"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select onValueChange={onPeriodChange} defaultValue="all-time">
            <SelectTrigger className="w-[140px] bg-black/20 border-siso-border">
              <Timer className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={onCategoryChange} defaultValue="points">
            <SelectTrigger className="w-[140px] bg-black/20 border-siso-border">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="points">Points</SelectItem>
              <SelectItem value="contributions">Contributions</SelectItem>
              <SelectItem value="referrals">Referrals</SelectItem>
              <SelectItem value="achievements">Achievements</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-black/20 border-siso-border hover:bg-siso-bg-alt"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Season 1
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/20 border-siso-border hover:bg-siso-bg-alt"
        >
          Jump to My Position
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-black/20 border-siso-border hover:bg-siso-bg-alt"
        >
          Export Leaderboard
        </Button>
      </div>
    </div>
  );
};
