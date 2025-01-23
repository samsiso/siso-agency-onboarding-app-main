import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardStats } from './LeaderboardStats';
import { LeaderboardTable } from './LeaderboardTable';
import type { LeaderboardEntry } from './types';

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [totalUsersWithPoints, setTotalUsersWithPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
    fetchTotalUsersWithPoints();

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
        }
      )
      .subscribe((status) => {
        console.log('Leaderboard subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
      // First, get all profiles with points
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          points,
          rank,
          updated_at
        `)
        .gt('points', 0)
        .order('points', { ascending: false })
        .limit(100);

      if (profilesError) throw profilesError;

      // Then, get the leaderboard data for these profiles
      const profileIds = profilesData?.map(profile => profile.id) || [];
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('*')
        .in('user_id', profileIds);

      if (leaderboardError) throw leaderboardError;

      // Combine the data
      const combinedData: LeaderboardEntry[] = profilesData?.map(profile => {
        const leaderboardEntry = leaderboardData?.find(entry => entry.user_id === profile.id);
        
        const achievements: Achievement[] = Array.isArray(leaderboardEntry?.achievements) 
          ? (leaderboardEntry.achievements as any[]).map(achievement => ({
              name: achievement.name || 'Unknown Achievement',
              icon: achievement.icon || '🏆'
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
            email: profile.email
          }
        };
      }) || [];

      console.log('Combined leaderboard data:', combinedData);
      setLeaderboardData(combinedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <LeaderboardStats 
        totalUsers={totalUsersWithPoints}
        totalPoints={totalPoints}
        activeUsers={activeUsers}
      />
      
      <Card className="border-siso-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-siso-text-bold">Leaderboard Rankings</span>
            <span className="text-sm font-normal text-siso-text-muted">
              Top {Math.min(leaderboardData.length, 100)} Users
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardTable leaderboardData={leaderboardData} />
        </CardContent>
      </Card>
    </div>
  );
};