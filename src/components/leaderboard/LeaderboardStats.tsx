import { Trophy, Users, Coins } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardStatsProps {
  totalUsers: number;
  totalPoints: number;
  totalSisoTokens: number;
}

export const LeaderboardStats = ({ totalUsers, totalPoints, totalSisoTokens }: LeaderboardStatsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-siso-bg-alt hover:border-siso-border-hover transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total Users</p>
              <p className="text-2xl font-bold text-siso-text-bold">{formatNumber(totalUsers)}</p>
            </div>
            <Users className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-siso-bg-alt hover:border-siso-border-hover transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total Points</p>
              <p className="text-2xl font-bold text-siso-text-bold">{formatNumber(totalPoints)}</p>
            </div>
            <Trophy className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-siso-bg-alt hover:border-siso-border-hover transition-colors">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total SISO Tokens</p>
              <p className="text-2xl font-bold text-siso-text-bold">{formatNumber(totalSisoTokens)}</p>
            </div>
            <Coins className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};