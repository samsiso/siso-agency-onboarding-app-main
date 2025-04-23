
import { useState } from 'react';
import { FinancialLayout } from '@/components/layout/FinancialLayout';
import { LeaderboardContent } from '@/components/leaderboard/components/LeaderboardContent';
import { LeaderboardStats } from '@/components/leaderboard/LeaderboardStats';
import { useLeaderboardData } from '@/components/leaderboard/hooks/useLeaderboardData';
import { useUser } from '@/hooks/useUser';
import { Spotlight } from '@/components/ui/spotlight';
import { LeaderboardEntry } from '@/components/leaderboard/types';

export default function LeaderboardsPage() {
  const { 
    entries, 
    stats, 
    trends,
    loading, 
    filter, 
    setFilter, 
    refreshLeaderboard 
  } = useLeaderboardData();
  
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter the entries based on search query
  const filteredEntries = entries.filter(entry => {
    const nameMatch = entry.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || searchQuery === '';
  });

  const handleUserClick = (entry: LeaderboardEntry) => {
    console.log('User clicked:', entry);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setFilter({
      ...filter,
      timeframe: period,
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Calculate total stats from entries
  const totalPoints = entries.reduce((sum, entry) => sum + entry.points, 0);
  const totalUsers = entries.length;
  const totalSisoTokens = entries.reduce((sum, entry) => sum + (entry.siso_tokens || 0), 0);

  return (
    <FinancialLayout title="Leaderboards">
      <div className="relative">
        <Spotlight className="-top-40 left-0" />
        
        <LeaderboardStats
          totalUsers={stats.totalParticipants}
          totalPoints={totalPoints}
          totalSisoTokens={totalSisoTokens}
        />
        
        <LeaderboardContent 
          filteredData={filteredEntries}
          onUserClick={handleUserClick}
          onSearchChange={handleSearchChange}
          onPeriodChange={handlePeriodChange}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </FinancialLayout>
  );
}
