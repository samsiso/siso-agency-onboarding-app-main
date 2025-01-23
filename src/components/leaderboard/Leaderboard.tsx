import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Star, Users, ArrowUp, ArrowDown } from 'lucide-react';
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

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number;
  rank: string;
  wins: number;
  losses: number;
  kda: number;
  season_rank: string;
  avatar_url: string | null;
  profiles: {
    full_name: string | null;
    email: string | null;
  };
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('leaderboard')
          .select(`
            *,
            profiles (
              full_name,
              email
            )
          `)
          .order('points', { ascending: false })
          .limit(50);

        if (error) throw error;
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
  }, [timeRange]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
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
          <h1 className="text-3xl font-bold text-siso-text-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-siso-orange" />
            Leaderboard Rankings
          </h1>
          <p className="text-siso-text/70">
            Compete with other players and climb the ranks
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
                    {getInitials(player.profiles.full_name || player.profiles.email?.split('@')[0] || 'User')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold text-siso-text-bold mb-1">
                {player.profiles.full_name || player.profiles.email?.split('@')[0] || 'Anonymous'}
              </h3>
              <p className="text-sm text-siso-text/70 mb-4">{player.season_rank}</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-siso-text/70">W/L</p>
                  <p className="font-bold text-siso-text-bold">{player.wins} - {player.losses}</p>
                </div>
                <div>
                  <p className="text-sm text-siso-text/70">Win Rate</p>
                  <p className={`font-bold ${getStatColor(getWinRate(player.wins, player.losses), 'winRate')}`}>
                    {getWinRate(player.wins, player.losses)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-siso-text/70">KDA</p>
                  <p className={`font-bold ${getStatColor(player.kda, 'kda')}`}>
                    {player.kda.toFixed(2)}
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
                <TableHead className="text-center">W/L</TableHead>
                <TableHead className="text-center">Win Rate</TableHead>
                <TableHead className="text-center">KDA</TableHead>
                <TableHead className="text-right">Points</TableHead>
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
                          {getInitials(player.profiles.full_name || player.profiles.email?.split('@')[0] || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-siso-text-bold">
                          {player.profiles.full_name || player.profiles.email?.split('@')[0] || 'Anonymous'}
                        </p>
                        <p className="text-sm text-siso-text/70">{player.season_rank}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {player.wins} - {player.losses}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getStatColor(getWinRate(player.wins, player.losses), 'winRate')}>
                      {getWinRate(player.wins, player.losses)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={getStatColor(player.kda, 'kda')}>
                      {player.kda.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-siso-orange">
                    {player.points}
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