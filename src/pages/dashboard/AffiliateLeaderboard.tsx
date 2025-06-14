import React from 'react';
import { motion } from 'framer-motion';
import { AffiliateLayout } from '@/components/dashboard/AffiliateLayout';
import { PartnerLeaderboard } from '@/components/dashboard/PartnerLeaderboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react';

const AffiliateLeaderboard = () => {
  const topPerformers = [
    { rank: 1, name: 'Sarah Johnson', referrals: 24, earnings: 12450, growth: '+18%', tier: 'Gold' },
    { rank: 2, name: 'Mike Chen', referrals: 18, earnings: 9890, growth: '+12%', tier: 'Silver' },
    { rank: 3, name: 'Emma Davis', referrals: 15, earnings: 8750, growth: '+8%', tier: 'Silver' },
    { rank: 4, name: 'James Wilson', referrals: 12, earnings: 6200, growth: '+5%', tier: 'Bronze' },
    { rank: 5, name: 'Lisa Brown', referrals: 10, earnings: 5100, growth: '+15%', tier: 'Bronze' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Silver':
        return 'bg-gray-300/20 text-gray-300 border-gray-300/30';
      case 'Bronze':
        return 'bg-amber-600/20 text-amber-600 border-amber-600/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AffiliateLayout
      title="Affiliate Leaderboard"
      subtitle="See how you stack up against other partners"
      actions={
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Star className="w-4 h-4 mr-2" />
          View My Stats
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Your Rank</CardTitle>
              <Trophy className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">#8</div>
              <p className="text-xs text-gray-400 mt-1">Out of 127 partners</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7</div>
              <p className="text-xs text-blue-400 mt-1">Referrals completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Earnings</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£3,450</div>
              <p className="text-xs text-green-400 mt-1">+£500 this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+22%</div>
              <p className="text-xs text-purple-400 mt-1">vs last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center">
                  <Award className="h-6 w-6 mr-2 text-orange-500" />
                  Top Performers This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <motion.div
                      key={performer.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-lg">
                          {getRankIcon(performer.rank)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{performer.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getTierColor(performer.tier)}>
                              {performer.tier}
                            </Badge>
                            <span className="text-sm text-gray-400">
                              {performer.referrals} referrals
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          £{performer.earnings.toLocaleString()}
                        </div>
                        <div className="text-sm text-green-400">
                          {performer.growth}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Leaderboard Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <PartnerLeaderboard />
          </motion.div>
        </div>

        {/* Achievement Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Target className="h-6 w-6 mr-2 text-orange-500" />
                Monthly Goals & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-700/50 rounded-lg">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Silver Tier</h3>
                  <p className="text-sm text-gray-400">Achieved this month! 🎉</p>
                </div>
                
                <div className="text-center p-6 bg-gray-700/50 rounded-lg">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">10 Referrals</h3>
                  <p className="text-sm text-gray-400">7/10 completed</p>
                </div>
                
                <div className="text-center p-6 bg-gray-700/50 rounded-lg">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">£5K Earnings</h3>
                  <p className="text-sm text-gray-400">£3.4K achieved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateLeaderboard; 