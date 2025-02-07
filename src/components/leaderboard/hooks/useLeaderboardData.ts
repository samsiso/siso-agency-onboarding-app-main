
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { LeaderboardEntry, Achievement } from '../types';

export const useLeaderboardData = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardEntry[]>([]);
  const [totalUsersWithPoints, setTotalUsersWithPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalSisoTokens, setTotalSisoTokens] = useState<number>(0);
  const { toast } = useToast();

  const fetchTotalPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .not('points', 'is', null);

      if (error) throw error;

      const total = data.reduce((sum, profile) => sum + (profile.points || 0), 0);
      setTotalPoints(total);
    } catch (error) {
      console.error('Error fetching total points:', error);
    }
  };

  const fetchTotalSisoTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('siso_tokens')
        .not('siso_tokens', 'is', null);

      if (error) throw error;

      const total = data.reduce((sum, entry) => sum + (entry.siso_tokens || 0), 0);
      setTotalSisoTokens(total);
    } catch (error) {
      console.error('Error fetching total SISO tokens:', error);
    }
  };

  const fetchTotalUsersWithPoints = async () => {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('points', 0);

      if (error) throw error;
      
      if (count !== null) {
        console.log('Total users with points:', count);
        setTotalUsersWithPoints(count);
      }
    } catch (error) {
      console.error('Error fetching total users count:', error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard data...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          points,
          rank,
          updated_at,
          bio,
          avatar_url,
          linkedin_url,
          website_url,
          youtube_url,
          instagram_url,
          twitter_url,
          professional_role
        `)
        .gt('points', 0)
        .order('points', { ascending: false })
        .limit(100);

      if (profilesError) throw profilesError;

      const profileIds = profilesData?.map(profile => profile.id) || [];
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .in('user_id', profileIds);

      if (leaderboardError) throw leaderboardError;

      const combinedData: LeaderboardEntry[] = profilesData?.map(profile => {
        const leaderboardEntry = leaderboardData?.find(entry => entry.user_id === profile.id);
        
        const achievements = Array.isArray(leaderboardEntry?.achievements) 
          ? leaderboardEntry.achievements.map((achievement: any) => ({
              name: achievement.name || '',
              icon: achievement.icon || ''
            }))
          : [];

        return {
          id: profile.id,
          user_id: profile.id,
          points: profile.points,
          rank: profile.rank,
          achievements: achievements,
          siso_tokens: leaderboardEntry?.siso_tokens || 0,
          updated_at: profile.updated_at,
          contribution_count: leaderboardEntry?.contribution_count || 0,
          referral_count: leaderboardEntry?.referral_count || 0,
          profile: {
            full_name: profile.full_name,
            email: profile.email,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            linkedin_url: profile.linkedin_url,
            website_url: profile.website_url,
            youtube_url: profile.youtube_url,
            instagram_url: profile.instagram_url,
            twitter_url: profile.twitter_url,
            professional_role: profile.professional_role
          }
        };
      }) || [];

      console.log('Combined leaderboard data:', combinedData);
      setLeaderboardData(combinedData);
      setFilteredData(combinedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchTotalUsersWithPoints();
    fetchTotalPoints();
    fetchTotalSisoTokens();

    // Set up real-time subscription
    const channel = supabase
      .channel('leaderboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Real-time profile update received:', payload);
          fetchLeaderboard();
          fetchTotalUsersWithPoints();
          fetchTotalPoints();
          fetchTotalSisoTokens();
        }
      )
      .subscribe((status) => {
        console.log('Leaderboard subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    leaderboardData,
    filteredData,
    setFilteredData,
    totalUsersWithPoints,
    totalPoints,
    totalSisoTokens,
  };
};
