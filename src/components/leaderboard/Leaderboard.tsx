import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, ChevronDown, ChevronUp, Clock, Users, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

interface Achievement {
  name: string;
  icon: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number | null;
  rank: string | null;
  achievements: Achievement[] | null;
  siso_tokens: number | null;
  updated_at: string;
  contribution_count: number | null;
  referral_count: number | null;
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
        .select('*')
        .order('points', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedData: LeaderboardEntry[] = data.map(entry => ({
          ...entry,
          achievements: Array.isArray(entry.achievements) 
            ? entry.achievements 
            : typeof entry.achievements === 'string'
              ? JSON.parse(entry.achievements)
              : entry.achievements || [],
          contribution_count: Math.floor(Math.random() * 50), // Placeholder - replace with actual data
          referral_count: Math.floor(Math.random() * 20), // Placeholder - replace with actual data
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
          <CardTitle>Leaderboard Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">#</TableHead>
                <TableHead className="text-center">Points</TableHead>
                <TableHead className="text-center">Contributions</TableHead>
                <TableHead className="text-center">Referrals</TableHead>
                <TableHead className="text-center">SISO Tokens</TableHead>
                <TableHead className="text-center">Days Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
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
                      {Math.floor((new Date().getTime() - new Date(entry.updated_at).getTime()) / (1000 * 60 * 60 * 24))}
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
