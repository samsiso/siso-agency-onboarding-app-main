import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, ChevronDown, ChevronUp, Clock, Users, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';

interface Achievement {
  name: string;
  icon: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number | null;
  rank: string | null;
  achievements: Achievement[];
  siso_tokens: number | null;
  updated_at: string;
  contribution_count: number | null;
  referral_count: number | null;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [totalUsersWithPoints, setTotalUsersWithPoints] = useState<number>(0);
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

      // Combine the data with proper type handling for achievements
      const combinedData: LeaderboardEntry[] = profilesData?.map(profile => {
        const leaderboardEntry = leaderboardData?.find(entry => entry.user_id === profile.id);
        
        // Transform the achievements data to match the Achievement interface
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

  const getDisplayName = (entry: LeaderboardEntry) => {
    if (entry.profile?.full_name) return entry.profile.full_name;
    if (entry.profile?.email) {
      const emailParts = entry.profile.email.split('@');
      return emailParts[0];
    }
    return 'Anonymous User';
  };

  const formatLastActive = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Leaderboard Statistics</span>
            <span className="text-sm font-normal text-muted-foreground">
              Total Users with Points: {totalUsersWithPoints}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Contributions</TableHead>
                <TableHead className="text-center">Referrals</TableHead>
                <TableHead className="text-center">SISO Tokens</TableHead>
                <TableHead className="text-center">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>{getDisplayName(entry)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      {entry.points || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {entry.contribution_count || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      {entry.referral_count || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {entry.siso_tokens || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatLastActive(entry.updated_at)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};