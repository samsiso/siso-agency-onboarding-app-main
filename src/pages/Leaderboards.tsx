import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      <h1 className="text-4xl font-bold mb-8">Leaderboards</h1>
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading leaderboard...</p>
        ) : (
          leaderboardData?.map((entry, index) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold">{entry.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-muted-foreground">{entry.points} points</p>
                </div>
                <span className="text-sm px-2 py-1 bg-accent rounded">{entry.rank}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboards;