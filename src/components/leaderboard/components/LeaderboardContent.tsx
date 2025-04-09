
import { LeaderboardStats } from "../LeaderboardStats";
import { LeaderboardFilters } from "../LeaderboardFilters";
import { LeaderboardTable } from "../LeaderboardTable";
import { EarnMoreCard } from "./EarnMoreCard";
import type { LeaderboardEntry } from "../types";

interface LeaderboardContentProps {
  leaderboardData: LeaderboardEntry[];
  filteredData: LeaderboardEntry[];
  setFilteredData: (data: LeaderboardEntry[]) => void;
  totalUsers: number;
  totalPoints: number;
  totalTokens: number;
  trends: {
    users: number;
    points: number;
    tokens: number;
  };
}

export function LeaderboardContent({
  leaderboardData,
  filteredData,
  setFilteredData,
  totalUsers,
  totalPoints,
  totalTokens,
  trends
}: LeaderboardContentProps) {
  return (
    <div className="w-full">
      <LeaderboardStats
        totalUsers={totalUsers}
        totalPoints={totalPoints}
        totalTokens={totalTokens}
        trends={trends}
      />
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <LeaderboardFilters 
            onFilterChange={setFilteredData} 
            leaderboardData={leaderboardData} 
          />
          <LeaderboardTable data={filteredData} />
        </div>
        
        <div className="mt-0 md:mt-[52px]">
          <EarnMoreCard />
        </div>
      </div>
    </div>
  );
}
