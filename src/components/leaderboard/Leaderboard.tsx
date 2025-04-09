
import { useState, useEffect } from 'react';
import { LeaderboardStats } from './LeaderboardStats';
import { EarnMoreCard } from './components/EarnMoreCard';
import { LeaderboardContent } from './components/LeaderboardContent';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import type { LeaderboardEntry } from './types';
import { useLeaderboardData } from './hooks/useLeaderboardData';

export const Leaderboard = () => {
  const {
    leaderboardData,
    filteredData,
    setFilteredData,
    totalUsersWithPoints,
    totalPoints,
    totalSisoTokens,
  } = useLeaderboardData();

  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('all-time');
  const [category, setCategory] = useState<string>('points');

  // Filter data when search query, time period, or category changes
  useEffect(() => {
    let filtered = [...leaderboardData];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply time period filter
    if (timePeriod !== 'all-time') {
      filtered = filtered.slice(0, timePeriod === 'daily' ? 10 : 
                                 timePeriod === 'weekly' ? 20 : 
                                 timePeriod === 'monthly' ? 50 : filtered.length);
    }

    // Apply category filter
    if (category !== 'points') {
      filtered.sort((a, b) => {
        if (category === 'contributions') {
          return (b.contribution_count || 0) - (a.contribution_count || 0);
        } else if (category === 'referrals') {
          return (b.referral_count || 0) - (a.referral_count || 0);
        } else if (category === 'achievements') {
          return (b.achievements?.length || 0) - (a.achievements?.length || 0);
        }
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [searchQuery, timePeriod, category, leaderboardData]);

  const handleUserClick = (user: LeaderboardEntry) => {
    setSelectedUser(user);
  };

  // Map LeaderboardEntry to CommunityMember type
  const mapToCommunityMember = (entry: LeaderboardEntry | null) => {
    if (!entry) return null;
    
    return {
      id: entry.id,
      name: entry.profile?.full_name || 'Anonymous User',
      description: entry.profile?.bio || undefined,
      member_type: 'Community',
      youtube_url: entry.profile?.youtube_url,
      website_url: entry.profile?.website_url,
      profile_image_url: entry.profile?.avatar_url,
      platform: undefined,
      points: entry.points || 0,
      rank: entry.rank,
      contribution_count: entry.contribution_count,
      referral_count: entry.referral_count,
      slug: entry.id, // Using id as slug since it's required
    };
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <LeaderboardStats 
        totalUsers={totalUsersWithPoints}
        totalPoints={totalPoints}
        totalSisoTokens={totalSisoTokens}
      />
      
      <EarnMoreCard />
      
      <LeaderboardContent
        filteredData={filteredData}
        onUserClick={handleUserClick}
        onSearchChange={setSearchQuery}
        onPeriodChange={setTimePeriod}
        onCategoryChange={setCategory}
      />

      <CommunityMemberDetails
        member={mapToCommunityMember(selectedUser)}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};
