import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  avatar_url: string | null;
  achievements: Achievement[] | null;
  siso_tokens: number | null;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    professional_role: string | null;
  } | null;
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
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

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Points Earned</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry, index) => (
                <>
                  <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRow(entry.id)}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={entry.avatar_url || ''} />
                          <AvatarFallback>
                            {entry.profiles?.full_name 
                              ? entry.profiles.full_name.charAt(0).toUpperCase()
                              : entry.profiles?.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {entry.profiles?.full_name || entry.profiles?.email?.split('@')[0] || 'Anonymous User'}
                          </p>
                          <p className="text-sm text-muted-foreground">{entry.profiles?.professional_role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        {entry.points || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(entry.updated_at), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {expandedRows.has(entry.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(entry.id) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Achievements</h4>
                              <div className="flex flex-wrap gap-2">
                                {entry.achievements?.map((achievement, i) => (
                                  <div key={i} className="flex items-center gap-1 text-sm bg-muted px-2 py-1 rounded">
                                    {achievement.name}
                                  </div>
                                )) || 'No achievements yet'}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">SISO Tokens</h4>
                              <p>{entry.siso_tokens || 0} tokens</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};