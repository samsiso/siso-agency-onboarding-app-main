import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Star, Users, ArrowUp, ArrowDown, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number | null;
  rank: string | null;
  wins: number | null;
  losses: number | null;
  kda: number | null;
  season_rank: string | null;
  avatar_url: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
    professional_role: string | null;
  } | null;
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log('Fetching leaderboard data...');
        const { data, error } = await supabase
          .from('leaderboard')
          .select(`
            *,
            profiles (
              full_name,
              email,
              professional_role
            )
          `)
          .order('points', { ascending: false })
          .limit(50);

        if (error) {
          console.error('Error fetching leaderboard:', error);
          throw error;
        }

        console.log('Leaderboard data:', data);
        setLeaderboardData(data || []);
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load leaderboard data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeRange, toast]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getWinRate = (wins: number | null, losses: number | null) => {
    const w = wins || 0;
    const l = losses || 0;
    const total = w + l;
    if (total === 0) return 0;
    return Math.round((w / total) * 100);
  };

  const getStatColor = (value: number, type: 'winRate' | 'kda') => {
    if (type === 'winRate') {
      if (value >= 60) return 'text-green-500';
      if (value <= 40) return 'text-red-500';
      return 'text-yellow-500';
    } else {
      if (value >= 3) return 'text-green-500';
      if (value <= 1) return 'text-red-500';
      return 'text-yellow-500';
    }
  };

  const getRankBadgeColor = (rank: string | null) => {
    if (!rank) return 'bg-orange-500/10 text-orange-500';
    switch (rank.toLowerCase()) {
      case 'diamond': return 'bg-blue-500/10 text-blue-500';
      case 'platinum': return 'bg-cyan-500/10 text-cyan-500';
      case 'gold': return 'bg-yellow-500/10 text-yellow-500';
      case 'silver': return 'bg-gray-500/10 text-gray-400';
      default: return 'bg-orange-500/10 text-orange-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-black/20 border-siso-text/10">
        <CardHeader>
          <CardTitle className="text-siso-text-bold">Top Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-siso-text/10 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topPlayers = leaderboardData.slice(0, 3);
  const otherPlayers = leaderboardData.slice(3);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
            Global Rankings
          </h1>
          <p className="text-siso-text/70">
            Compete with players worldwide and climb the ranks
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Users className="w-4 h-4" />
          Invite Friends
        </Button>
      </div>

      {/* Time Range Tabs */}
      <Tabs defaultValue="24h" className="w-full" onValueChange={setTimeRange}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="24h">24h</TabsTrigger>
          <TabsTrigger value="7d">7D</TabsTrigger>
          <TabsTrigger value="30d">30D</TabsTrigger>
          <TabsTrigger value="season">Season</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Top Players Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPlayers.map((player, index) => (
          <Card key={player.id} className="bg-black/20 border-siso-text/10 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-2xl font-bold text-siso-text/20">
              #{index + 1}
            </div>
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <Avatar className="w-20 h-20 mx-auto border-4 border-siso-orange">
                  <AvatarImage src={player.avatar_url || undefined} />
                  <AvatarFallback>
                    {getInitials(player.profiles?.full_name || player.profiles?.email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold text-siso-text-bold mb-1">
                {player.profiles?.full_name || player.profiles?.email?.split('@')[0] || 'Anonymous'}
              </h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline" className={getRankBadgeColor(player.season_rank)}>
                  {player.season_rank || 'Unranked'}
                </Badge>
                {player.profiles?.professional_role && (
                  <Badge variant="outline" className="bg-siso-text/5">
                    <MapPin className="w-3 h-3 mr-1" />
                    {player.profiles.professional_role}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-siso-text/70">Points</p>
                  <p className="font-bold text-siso-text-bold">{player.points || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-siso-text/70">Win Rate</p>
                  <p className={`font-bold ${getStatColor(getWinRate(player.wins, player.losses), 'winRate')}`}>
                    {getWinRate(player.wins, player.losses)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-siso-text/70">KDA</p>
                  <p className={`font-bold ${getStatColor(player.kda || 0, 'kda')}`}>
                    {(player.kda || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard Table */}
      <Card className="bg-black/20 border-siso-text/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">W/L</TableHead>
                <TableHead className="text-center">Win Rate</TableHead>
                <TableHead className="text-center">KDA</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherPlayers.map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">#{index + 4}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={player.avatar_url || undefined} />
                        <AvatarFallback>
                          {getInitials(player.profiles?.full_name || player.profiles?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-siso-text-bold">
                            {player.profiles?.full_name || player.profiles?.email?.split('@')[0] || 'Anonymous'}
                          </p>
                          <Badge variant="outline" className={getRankBadgeColor(player.season_rank)}>
                            {player.season_rank || 'Unranked'}
                          </Badge>
                        </div>
                        {player.profiles?.professional_role && (
                          <p className="text-sm text-siso-text/70 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {player.profiles.professional_role}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-siso-orange">
                    {player.points || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {player.wins || 0} - {player.losses || 0}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getStatColor(getWinRate(player.wins, player.losses), 'winRate')}>
                      {getWinRate(player.wins, player.losses)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getStatColor(player.kda || 0, 'kda')}>
                      {(player.kda || 0).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-siso-text/70">
                    {player.profiles?.professional_role || '-'}
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

export default Leaderboard;