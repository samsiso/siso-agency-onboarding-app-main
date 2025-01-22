import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number;
  rank: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  };
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
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
          .limit(10);

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
  }, []);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <Star className="w-6 h-6 text-siso-text/40" />;
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

  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="text-siso-text-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-siso-orange" />
          Top Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-siso-text/5 border border-siso-text/10"
            >
              <div className="flex-shrink-0">
                {getRankIcon(index)}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-siso-text-bold">
                  {entry.profiles.full_name || entry.profiles.email?.split('@')[0] || 'Anonymous'}
                </p>
                <div className="flex items-center gap-2 text-xs text-siso-text/70">
                  <span>{entry.points} points</span>
                  <span>•</span>
                  <span>{entry.rank}</span>
                </div>
              </div>
              <div className="flex-shrink-0 text-2xl font-bold text-siso-text/70">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};