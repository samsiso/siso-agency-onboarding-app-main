import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, ChevronDown, ChevronUp, Clock, Linkedin, Globe, Youtube, Instagram, Twitter, Users, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  contribution_count: number | null;
  referral_count: number | null;
  profiles: {
    full_name: string | null;
    email: string | null;
    professional_role: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    youtube_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
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
            professional_role,
            linkedin_url,
            website_url,
            youtube_url,
            instagram_url,
            twitter_url
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
                <TableHead>Community Impact</TableHead>
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
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {entry.profiles?.full_name || entry.profiles?.email?.split('@')[0] || 'Anonymous User'}
                            </p>
                            <div className="flex gap-2">
                              {entry.profiles?.linkedin_url && (
                                <a 
                                  href={entry.profiles.linkedin_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              )}
                              {entry.profiles?.website_url && (
                                <a 
                                  href={entry.profiles.website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Globe className="h-4 w-4" />
                                </a>
                              )}
                              {entry.profiles?.youtube_url && (
                                <a 
                                  href={entry.profiles.youtube_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Youtube className="h-4 w-4" />
                                </a>
                              )}
                              {entry.profiles?.instagram_url && (
                                <a 
                                  href={entry.profiles.instagram_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Instagram className="h-4 w-4" />
                                </a>
                              )}
                              {entry.profiles?.twitter_url && (
                                <a 
                                  href={entry.profiles.twitter_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                  <Twitter className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.profiles?.professional_role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.contribution_count || 0} contributions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <UserPlus className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.referral_count || 0} referrals</span>
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
                      <TableCell colSpan={6}>
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