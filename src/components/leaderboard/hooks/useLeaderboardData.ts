
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { safeSupabase } from '@/utils/supabaseHelpers';
import { LeaderboardEntry, LeaderboardFilter, LeaderboardStats, TrendStats } from '../types';

export const useLeaderboardData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalParticipants: 0,
    avgPoints: 0,
    topScore: 0
  });
  
  // Fix the TrendStats initialization by including all required properties
  const [trends, setTrends] = useState<TrendStats>({
    trend: 'stable',
    percentage: 0,
    points: 0,
    users: 0,
    tokens: 0
  });
  
  const [filter, setFilter] = useState<LeaderboardFilter>({
    timeframe: 'week'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboardData();
  }, [filter]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for leaderboard entries with properly structured objects
      const mockEntries: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
        id: `user-${i + 1}`,
        user_id: `user-${i + 1}`,
        points: Math.floor(Math.random() * 1000) + 100,
        level: Math.floor(Math.random() * 10) + 1,
        streak_days: Math.floor(Math.random() * 30),
        rank: (i + 1).toString(),
        siso_tokens: Math.floor(Math.random() * 500),
        updated_at: new Date().toISOString(),
        contribution_count: Math.floor(Math.random() * 50),
        referral_count: Math.floor(Math.random() * 20),
        achievements: [
          { name: 'First Contribution', icon: '🏆' },
          { name: 'Streak Master', icon: '🔥' }
        ],
        profile: {
          full_name: `User ${i + 1}`,
          avatar_url: '',
          bio: `This is user ${i + 1}'s bio`,
          professional_role: 'Developer'
        }
      }));

      setEntries(mockEntries);
      
      // Set mock statistics
      setStats({
        totalParticipants: mockEntries.length,
        avgPoints: Math.floor(mockEntries.reduce((sum, entry) => sum + entry.points, 0) / mockEntries.length),
        topScore: Math.max(...mockEntries.map(entry => entry.points))
      });
      
      // Set trends with ALL required properties
      setTrends({
        trend: Math.random() > 0.5 ? 'up' : 'down', 
        percentage: Math.floor(Math.random() * 30),
        points: Math.floor(Math.random() * 1000),
        users: Math.floor(Math.random() * 100),
        tokens: Math.floor(Math.random() * 5000)
      });
      
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      toast({
        variant: "destructive",
        title: "Failed to load leaderboard",
        description: "There was an error loading the leaderboard data.",
      });
      
      // Set empty data on error
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshLeaderboard = () => {
    fetchLeaderboardData();
  };

  return {
    entries,
    stats,
    trends,
    loading,
    filter,
    setFilter,
    refreshLeaderboard
  };
};
