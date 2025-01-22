import { useQuery } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Leaderboards = () => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select(`
          *,
          profiles:profiles(full_name, email)
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
          Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))
        ) : (
          leaderboardData?.map((entry, index) => (
            <Card key={entry.id} className="p-4 flex items-center gap-4 bg-black/20 border-siso-text/10">
              <div className="flex items-center justify-center w-8 h-8">
                {index < 3 ? (
                  <Medal className={`w-6 h-6 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    'text-amber-600'
                  }`} />
                ) : (
                  <span className="text-lg font-bold text-siso-text/60">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-siso-text-bold">{entry.profiles?.full_name || 'Anonymous'}</p>
                <p className="text-sm text-siso-text/60">{entry.profiles?.email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-siso-orange">{entry.points} points</p>
                <p className="text-xs text-siso-text/60">{entry.rank}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboards;