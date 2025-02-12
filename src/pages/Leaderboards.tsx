
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { Sidebar } from '@/components/Sidebar';
import { Trophy, Users, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useLeaderboardData } from '@/components/leaderboard/hooks/useLeaderboardData';
import { formatNumber } from '@/lib/formatters';

const Leaderboards = () => {
  const { totalUsersWithPoints, totalPoints, totalSisoTokens, trends } = useLeaderboardData();

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) return null;
    
    return (
      <span className={`text-xs flex items-center gap-1 ${value > 0 ? 'text-green-500' : 'text-red-500'}`}>
        {value > 0 ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 via-siso-orange/5 to-transparent rounded-lg" />
            <Card className="relative border-siso-border bg-black/20 backdrop-blur-sm overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <GradientHeading
                      size="lg"
                      variant="sunset"
                      className="!pb-2 tracking-tight"
                    >
                      Community Leaderboard
                    </GradientHeading>
                    <p className="text-siso-text/80 max-w-2xl">
                      Compete with other members, earn points through contributions, and climb the ranks. 
                      Your impact on the community is recognized and rewarded.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="relative">
                      <Trophy className="w-16 h-16 text-siso-orange opacity-90" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-siso-orange/20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-siso-bg-alt/50 border border-siso-border"
                  >
                    <Trophy className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-siso-text/70">Current Season</p>
                      <p className="text-lg font-semibold text-siso-text-bold">Season 1</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-siso-bg-alt/50 border border-siso-border"
                  >
                    <Users className="w-8 h-8 text-siso-orange" />
                    <div>
                      <p className="text-sm text-siso-text/70">Active Players</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-siso-text-bold">
                          {formatNumber(totalUsersWithPoints)}
                        </p>
                        <TrendIndicator value={trends.users} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-siso-bg-alt/50 border border-siso-border"
                  >
                    <Award className="w-8 h-8 text-siso-red" />
                    <div>
                      <p className="text-sm text-siso-text/70">Total Points</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-siso-text-bold">
                          {formatNumber(totalPoints)}
                        </p>
                        <TrendIndicator value={trends.points} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Card>
          </div>

          {/* Main Leaderboard Component */}
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
