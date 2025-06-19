
import { Trophy, Users, Coins, TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import CountUp from 'react-countup';

interface LeaderboardStatsProps {
  totalUsers: number;
  totalPoints: number;
  totalSisoTokens: number;
}

export const LeaderboardStats = ({ totalUsers, totalPoints, totalSisoTokens }: LeaderboardStatsProps) => {
  // Helper function to format numbers with thousand separators
  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-siso-bg-alt to-siso-bg-alt/50 hover:border-siso-border-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total Users</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-siso-text-bold">
                  <CountUp
                    end={totalUsers}
                    delay={0}
                    decimals={0}
                  />
                </p>
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5%
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-siso-bg-alt to-siso-bg-alt/50 hover:border-siso-border-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total Points</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-siso-text-bold">
                  <CountUp
                    end={totalPoints}
                    delay={0}
                    decimals={0}
                  />
                </p>
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </span>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-siso-bg-alt to-siso-bg-alt/50 hover:border-siso-border-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total SISO Tokens</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-siso-text-bold">
                  <CountUp
                    end={totalSisoTokens}
                    delay={0}
                    decimals={0}
                  />
                </p>
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8%
                </span>
              </div>
            </div>
            <Coins className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-siso-bg-alt to-siso-bg-alt/50 hover:border-siso-border-hover transition-all duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Daily Active Users</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-siso-text-bold">
                  <CountUp
                    end={Math.floor(totalUsers * 0.4)}
                    delay={0}
                    decimals={0}
                  />
                </p>
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15%
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
