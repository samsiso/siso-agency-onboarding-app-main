import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LeaderboardEntry, LeaderboardFilter, LeaderboardStats, TrendStats } from '../types';
import { safeGet } from '@/utils/typeHelpers'; 

export const useLeaderboardData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    totalParticipants: 0,
    avgPoints: 0,
    topScore: 0
  });
  
  const [trends, setTrends] = useState<TrendStats>({
    trend: 'up',
    percentage: 0,
    points: 0,
    users: 0,
    tokens: 0,
  });
  
  const [filter, setFilter] = useState<LeaderboardFilter>({
    timeframe: 'week'
  });
  
  const { toast } = useToast();

  const fetchLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // In a real implementation, we would fetch from the database based on filters
      // For now, we're using mock data
      
      // Try to fetch leaderboard entries from the database
      const { data: dbEntries, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('points', { ascending: false })
        .limit(100);
      
      // If database fetch fails or returns no data, use mock data
      if (error || !dbEntries || dbEntries.length === 0) {
        console.log('Using mock leaderboard data');
        
        // Create mock entries with realistic data structure
        const mockEntries: LeaderboardEntry[] = [
          {
            id: '1',
            name: 'Optimal Construction',
            website_url: 'https://optimal-building-maintenance.vercel.app/',
            points: 1500,
            spending: 15000,
            siso_tokens: 3000,
            milestones_achieved: '4/8',
            client_engagement: 60,
            community_impact: 5,
            updated_at: '2025-03-01T00:00:00Z',
            description: 'Building maintenance and construction services',
            status: 'in-progress',
            rank: 1
          },
          {
            id: '2',
            name: 'UbahCryp',
            website_url: 'https://ubahcrypcom.vercel.app/',
            points: 500,
            spending: 5000,
            siso_tokens: 1000,
            milestones_achieved: '8/8',
            client_engagement: 90,
            community_impact: 10,
            updated_at: '2025-03-20T00:00:00Z',
            description: 'A cryptocurrency trading platform built with React and Web3 technologies',
            status: 'completed',
            rank: 2
          },
          {
            id: '3',
            name: 'Gritness',
            website_url: 'https://gritnessgym.vercel.app/',
            points: 25,
            spending: 249,
            siso_tokens: 50,
            milestones_achieved: '6/8',
            client_engagement: 40,
            community_impact: 3,
            updated_at: '2025-05-09T00:00:00Z',
            description: 'A gym management and fitness tracking application',
            status: 'in-progress',
            rank: 3
          },
          {
            id: '4',
            name: 'Trojan MMA',
            website_url: 'https://trojan-mma.vercel.app/',
            points: 25,
            spending: 249,
            siso_tokens: 50,
            milestones_achieved: '6/8',
            client_engagement: 35,
            community_impact: 2,
            updated_at: '2025-03-27T00:00:00Z',
            description: 'MMA gym and training center website',
            status: 'in-progress',
            rank: 4
          },
          {
            id: '5',
            name: 'Lets Go',
            website_url: 'https://lets-go-u7hh.vercel.app/',
            points: 25,
            spending: 249,
            siso_tokens: 50,
            milestones_achieved: '7/8',
            client_engagement: 80,
            community_impact: 4,
            updated_at: '2025-03-26T00:00:00Z',
            description: 'Travel and adventure booking platform',
            status: 'nearly-completed',
            rank: 5
          },
          {
            id: '6',
            name: 'NM Construction',
            website_url: 'https://nm-construction.vercel.app/',
            points: 0,
            spending: 0,
            siso_tokens: 0,
            milestones_achieved: '4/8',
            client_engagement: 50,
            community_impact: 1,
            updated_at: '2025-03-01T00:00:00Z',
            description: 'Construction company website with project portfolio',
            status: 'in-progress',
            rank: 6
          },
          {
            id: '7',
            name: 'Elementree',
            website_url: 'https://elementree.vercel.app/',
            points: 0,
            spending: 0,
            siso_tokens: 0,
            milestones_achieved: '5/8',
            client_engagement: 30,
            community_impact: 1,
            updated_at: '2025-05-09T00:00:00Z',
            description: 'Arborist and tree care services website',
            status: 'in-progress',
            rank: 7
          },
          {
            id: '8',
            name: 'Mu Shin',
            website_url: 'https://siso-mu-shin.vercel.app/',
            points: 0,
            spending: 0,
            siso_tokens: 0,
            milestones_achieved: '8/8',
            client_engagement: 20,
            community_impact: 0,
            updated_at: '2025-03-20T00:00:00Z',
            description: 'Martial arts school and training center',
            status: 'declined',
            rank: 8
          },
          {
            id: '9',
            name: '5 Star Hire',
            website_url: 'https://5-star-hire.vercel.app/',
            points: 0,
            spending: 0,
            siso_tokens: 0,
            milestones_achieved: '3/8',
            client_engagement: 25,
            community_impact: 0,
            updated_at: '2025-05-09T00:00:00Z',
            description: 'Equipment hire and rental service',
            status: 'early-progress',
            rank: 9
          },
          {
            id: '10',
            name: 'Keegan Saas',
            website_url: '',
            points: 0,
            spending: 0,
            siso_tokens: 0,
            milestones_achieved: '0/8',
            client_engagement: 15,
            community_impact: 0,
            updated_at: '2025-05-09T00:00:00Z',
            description: 'SaaS platform for business management',
            status: 'not-started',
            rank: 10
          }
        ];
        
        setEntries(mockEntries);
        
        // Set realistic stats based on the project data
        const totalPoints = mockEntries.reduce((sum, entry) => sum + entry.points, 0);
        const avgPoints = Math.round(totalPoints / mockEntries.length);
        const topScore = mockEntries[0]?.points || 0;

        setStats({
          totalParticipants: mockEntries.length,
          avgPoints,
          topScore,
        });

        // Set realistic trends
        setTrends({
          trend: 'up',
          percentage: 12,
          points: 125,
          users: 3,
          tokens: 250,
        });
      } else {
        console.log('Using real leaderboard data');
        
        // Map database entries to our LeaderboardEntry type using safe property access
        const mappedEntries: LeaderboardEntry[] = dbEntries.map((dbEntry, index) => ({
          id: dbEntry.id,
          name: safeGet(dbEntry, 'name', ''),
          website_url: safeGet(dbEntry, 'website_url', ''),
          points: dbEntry.points || 0,
          level: dbEntry.level || 1,
          streak_days: dbEntry.streak_days || 0,
          rank: dbEntry.rank?.toString() || '',
          siso_tokens: safeGet(dbEntry.profile, 'siso_tokens', 0),
          updated_at: dbEntry.updated_at,
          contribution_count: 0, // Add this data when available
          referral_count: 0, // Add this data when available
          achievements: [], // Add this data when available
          profile: {
            full_name: safeGet(dbEntry.profile, 'full_name', 'Anonymous'),
            email: safeGet(dbEntry.profile, 'email', ''),
            avatar_url: safeGet(dbEntry.profile, 'avatar_url', ''),
            bio: safeGet(dbEntry.profile, 'bio', ''),
            professional_role: safeGet(dbEntry.profile, 'professional_role', '')
          }
        }));
        
        setEntries(mappedEntries);
        
        // Calculate stats from real data
        setStats({
          totalParticipants: mappedEntries.length,
          avgPoints: Math.floor(mappedEntries.reduce((sum, entry) => sum + entry.points, 0) / mappedEntries.length) || 0,
          topScore: Math.max(...mappedEntries.map(entry => entry.points)) || 0
        });
        
        // Set basic trends (in a real app, this would come from historical data analysis)
        setTrends({
          trend: 'up',
          percentage: 12,
          points: Math.floor(mappedEntries.reduce((sum, entry) => sum + entry.points, 0) * 0.12),
          users: Math.floor(mappedEntries.length * 0.05),
          tokens: Math.floor(mappedEntries.reduce((sum, entry) => sum + (entry.siso_tokens || 0), 0) * 0.08)
        });
      }
      
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
  }, [filter, toast]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData, filter]);

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
