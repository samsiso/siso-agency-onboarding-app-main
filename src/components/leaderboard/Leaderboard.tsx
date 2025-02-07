import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardStats } from './LeaderboardStats';
import { LeaderboardTable } from './LeaderboardTable';
import { LeaderboardFilters } from './LeaderboardFilters';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import { Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LeaderboardEntry } from './types';

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [filteredData, setFilteredData] = useState<LeaderboardEntry[]>([]);
  const [totalUsersWithPoints, setTotalUsersWithPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [totalSisoTokens, setTotalSisoTokens] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('all-time');
  const [category, setCategory] = useState<string>('points');
  const { toast } = useToast();

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
    // Note: This is a simplified version. In a real app, you'd need to store timestamps
    // and filter based on actual dates
    if (timePeriod !== 'all-time') {
      // This is just a demonstration. You'd need to implement proper time-based filtering
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

      const combinedData = profilesData?.map(profile => {
        const leaderboardEntry = leaderboardData?.find(entry => entry.user_id === profile.id);
        
        return {
          id: profile.id,
          user_id: profile.id,
          points: profile.points,
          rank: profile.rank,
          achievements: leaderboardEntry?.achievements || [],
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

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <LeaderboardStats 
        totalUsers={totalUsersWithPoints}
        totalPoints={totalPoints}
        totalSisoTokens={totalSisoTokens}
      />
      
      <Link 
        to="/economy/earn"
        className="block w-full p-4 mb-6 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
          border border-siso-border hover:border-siso-border-hover rounded-lg 
          transition-all duration-300 group hover:shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-siso-orange" />
            <div>
              <h3 className="text-lg font-semibold text-siso-text-bold">
                Want to climb the leaderboard?
              </h3>
              <p className="text-sm text-siso-text/80">
                Learn how to earn more points and reach the top!
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-siso-orange transform transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
      
      <Card className="border-siso-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-siso-text-bold">Leaderboard Rankings</span>
            <span className="text-sm font-normal text-siso-text-muted">
              Top {Math.min(filteredData.length, 100)} Users
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaderboardFilters
            onSearchChange={setSearchQuery}
            onPeriodChange={setTimePeriod}
            onCategoryChange={setCategory}
          />
          <LeaderboardTable 
            leaderboardData={filteredData} 
            onUserClick={handleUserClick}
          />
        </CardContent>
      </Card>

      <CommunityMemberDetails
        member={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
};
