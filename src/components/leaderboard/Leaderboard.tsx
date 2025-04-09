
import { useState, useEffect } from 'react';
import { useLeaderboardData } from './hooks/useLeaderboardData';
import { LeaderboardContent } from './components/LeaderboardContent';
import { Skeleton } from '@/components/ui/skeleton';

export function Leaderboard() {
  const {
    leaderboardData,
    filteredData,
    setFilteredData,
    totalUsersWithPoints,
    totalPoints,
    totalSisoTokens,
    trends
  } = useLeaderboardData();
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading to ensure data is fetched
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <LeaderboardSkeleton />;
  }
  
  return (
    <LeaderboardContent
      leaderboardData={leaderboardData}
      filteredData={filteredData}
      setFilteredData={setFilteredData}
      totalUsers={totalUsersWithPoints}
      totalPoints={totalPoints}
      totalTokens={totalSisoTokens}
      trends={trends}
    />
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[130px] bg-black/20" />
        ))}
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <Skeleton className="h-10 w-full max-w-md bg-black/20" />
            <Skeleton className="h-10 w-[180px] mt-4 md:mt-0 bg-black/20" />
          </div>
          
          <Skeleton className="h-[400px] bg-black/20" />
        </div>
        
        <div className="mt-0 md:mt-[52px]">
          <Skeleton className="h-[350px] bg-black/20" />
        </div>
      </div>
    </div>
  );
}
