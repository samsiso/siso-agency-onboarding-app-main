
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
          <span className="text-siso-text-bold">Leaderboard Rankings</span>
          <span className="text-sm font-normal text-siso-text-muted">
            Top {Math.min(filteredData.length, 100)} Users
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
