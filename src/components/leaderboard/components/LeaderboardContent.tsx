
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardFilters } from '../LeaderboardFilters';
import { LeaderboardTable } from '../LeaderboardTable';
import type { LeaderboardEntry } from '../types';

interface LeaderboardContentProps {
  filteredData: LeaderboardEntry[];
  onUserClick: (user: LeaderboardEntry) => void;
  onSearchChange: (search: string) => void;
  onPeriodChange: (period: string) => void;
  onCategoryChange: (category: string) => void;
}

export const LeaderboardContent = ({
  filteredData,
  onUserClick,
  onSearchChange,
  onPeriodChange,
  onCategoryChange,
}: LeaderboardContentProps) => {
  return (
    <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-siso-text-bold">Top 10 Projects: Celebrating Our Biggest Achievements</span>
          <span className="text-sm font-normal text-siso-text-muted">
            Showcasing innovation and investment across {Math.min(filteredData.length, 10)} projects
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LeaderboardFilters
          onSearchChange={onSearchChange}
          onPeriodChange={onPeriodChange}
          onCategoryChange={onCategoryChange}
        />
        <LeaderboardTable 
          leaderboardData={filteredData} 
          onUserClick={onUserClick}
        />
      </CardContent>
    </Card>
  );
};
