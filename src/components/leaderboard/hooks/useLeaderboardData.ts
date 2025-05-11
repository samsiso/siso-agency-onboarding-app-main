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
        
        // Mock client data with realistic names and companies
        const clients = [
          { name: 'Sarah Johnson', company: 'FitFlow Manager', role: 'Fitness Studio Owner', industry: 'Health & Wellness' },
          { name: 'Michael Chen', company: 'CreatorHub Studio', role: 'Content Creator', industry: 'Digital Media' },
          { name: 'Alex Rodriguez', company: 'Agency Suite Pro', role: 'Agency Director', industry: 'Marketing' },
          { name: 'Jessica Williams', company: 'TechSolve AI', role: 'CTO', industry: 'Technology' },
          { name: 'David Kim', company: 'Foodie Marketplace', role: 'Restaurant Owner', industry: 'Food & Beverage' },
          { name: 'Priya Patel', company: 'EduLearn Platform', role: 'Educational Consultant', industry: 'Education' },
          { name: 'James Anderson', company: 'Property Connect', role: 'Real Estate Agent', industry: 'Real Estate' },
          { name: 'Emma Thompson', company: 'Beauty Booking Pro', role: 'Salon Owner', industry: 'Beauty & Wellness' },
          { name: 'Omar Hassan', company: 'TravelPlanner AI', role: 'Travel Agency Director', industry: 'Travel' },
          { name: 'Sophia Garcia', company: 'RetailFlow Systems', role: 'Retail Manager', industry: 'Retail' },
          { name: 'Ryan Mitchell', company: 'EventMaster Pro', role: 'Event Coordinator', industry: 'Events & Entertainment' },
          { name: 'Olivia Wilson', company: 'HealthTrack Solutions', role: 'Healthcare Administrator', industry: 'Healthcare' }
        ];
        
        // Create mock entries with realistic data structure
        const mockEntries: LeaderboardEntry[] = clients.map((client, i) => ({
          id: `user-${i + 1}`,
          user_id: `user-${i + 1}`,
          points: Math.floor(Math.random() * 1000) + 100,
          level: Math.floor(Math.random() * 10) + 1,
          streak_days: Math.floor(Math.random() * 30),
          rank: i === 0 ? 'Master' : i < 3 ? 'Expert' : i < 7 ? 'Advanced' : 'Intermediate',
          siso_tokens: Math.floor(Math.random() * 500),
          updated_at: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
          contribution_count: Math.floor(Math.random() * 50),
          referral_count: Math.floor(Math.random() * 20),
          achievements: [
            { name: 'First Contribution', icon: '🏆' },
            { name: 'Streak Master', icon: '🔥' }
          ],
          profile: {
            full_name: client.name,
            email: `${client.name.toLowerCase().replace(' ', '.')}@example.com`,
            avatar_url: '',
            bio: `${client.role} at ${client.company}`,
            professional_role: client.role,
            business_name: client.company,
            industry: client.industry
          }
        }));
        
        setEntries(mockEntries);
        
        // Set mock statistics based on the mock entries
        setStats({
          totalParticipants: mockEntries.length,
          avgPoints: Math.floor(mockEntries.reduce((sum, entry) => sum + entry.points, 0) / mockEntries.length),
          topScore: Math.max(...mockEntries.map(entry => entry.points))
        });
        
        // Set mock trends
        setTrends({
          trend: Math.random() > 0.5 ? 'up' : 'down',
          percentage: Math.floor(Math.random() * 30),
          points: Math.floor(mockEntries.reduce((sum, entry) => sum + entry.points, 0) * 0.1),
          users: Math.floor(mockEntries.length * 0.05),
          tokens: Math.floor(mockEntries.reduce((sum, entry) => sum + (entry.siso_tokens || 0), 0) * 0.08)
        });
      } else {
        console.log('Using real leaderboard data');
        
        // Map database entries to our LeaderboardEntry type using safe property access
        const mappedEntries: LeaderboardEntry[] = dbEntries.map((dbEntry, index) => ({
          id: dbEntry.id,
          user_id: dbEntry.user_id,
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
            professional_role: safeGet(dbEntry.profile, 'professional_role', ''),
            business_name: safeGet(dbEntry.profile, 'business_name', ''),
            industry: safeGet(dbEntry.profile, 'industry', '')
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
