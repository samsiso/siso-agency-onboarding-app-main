import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Star, Users, ArrowUp, ArrowDown, MapPin, Clock, Award, Coins } from 'lucide-react';
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

interface Achievement {
  name: string;
  icon: string;
}

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
  achievements: Achievement[] | null;
  siso_tokens: number | null;
  profiles: {
    full_name: string | null;
    email: string | null;
    professional_role: string | null;
  } | null;
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
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
        .order('points', { ascending: false });

      if (error) throw error;

      if (data) {
        // Transform the data to ensure achievements is properly typed
        const transformedData: LeaderboardEntry[] = data.map(entry => ({
          ...entry,
          achievements: Array.isArray(entry.achievements) 
            ? entry.achievements 
            : typeof entry.achievements === 'string'
              ? JSON.parse(entry.achievements)
              : entry.achievements || [],
        }));
        setLeaderboardData(transformedData);
      }
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Losses</TableHead>
                <TableHead>KDA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={entry.avatar_url || ''} />
                      <AvatarFallback>{entry.profiles?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {entry.profiles?.full_name}
                  </TableCell>
                  <TableCell>{entry.points}</TableCell>
                  <TableCell>{entry.wins}</TableCell>
                  <TableCell>{entry.losses}</TableCell>
                  <TableCell>{entry.kda}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
