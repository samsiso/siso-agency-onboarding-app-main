
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { LeaderboardContent } from '@/components/leaderboard/components/LeaderboardContent';
import { LeaderboardStats } from '@/components/leaderboard/LeaderboardStats';
import { useLeaderboardData } from '@/components/leaderboard/hooks/useLeaderboardData';
import { useUser } from '@/hooks/useUser';
import { Spotlight } from '@/components/ui/spotlight';
import { LeaderboardEntry } from '@/components/leaderboard/types';

export default function LeaderboardPage() {
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

  // Filter the entries based on search query and filters
  const filteredEntries = entries.filter(entry => {
    const nameMatch = entry.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    // Add more filtering logic here as needed
    return nameMatch || searchQuery === '';
  });

  // Handle user click - can be expanded to show detailed profile
  const handleUserClick = (entry: LeaderboardEntry) => {
    console.log('User clicked:', entry);
    // Could navigate to profile page or open modal with details
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
    // Update filter with category when backend supports this
  };

  // Calculate total stats from entries
  const totalPoints = entries.reduce((sum, entry) => sum + entry.points, 0);
  const totalUsers = entries.length;
  const totalSisoTokens = entries.reduce((sum, entry) => sum + (entry.siso_tokens || 0), 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="relative">
          <Spotlight className="-top-40 left-0" />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent mb-2">
              Community Leaderboard
            </h1>
            <p className="text-siso-text/80">
              Track community contributions, points earned, and rewards across the SISO platform.
            </p>
          </div>
          
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
      </div>
    </MainLayout>
  );
}
