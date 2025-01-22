import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Loader2 } from 'lucide-react';

const Leaderboards = () => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .order('points', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="w-8 h-8 text-siso-orange" />
        <h1 className="text-3xl font-bold text-siso-text-bold">Leaderboards</h1>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-siso-orange" />
          </div>
        ) : (
          leaderboardData?.map((entry, index) => (
            <Card key={entry.id} className="p-4 bg-black/20 border-siso-text/10 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-siso-orange">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-siso-text-bold">{entry.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-siso-text/80">{entry.points.toLocaleString()} points</p>
                </div>
                <span className="text-sm px-2 py-1 bg-siso-text/5 rounded text-siso-text/80">{entry.rank}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboards;