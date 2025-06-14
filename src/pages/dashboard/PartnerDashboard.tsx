import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  totalEarnings: number;
  monthlyEarnings: number;
  activeReferrals: number;
  completedReferrals: number;
  conversionRate: number;
  currentTier: string;
  nextTierProgress: number;
}

interface RecentActivity {
  id: string;
  type: 'referral_submitted' | 'referral_approved' | 'payment_received' | 'tier_upgraded';
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: 'success' | 'pending' | 'warning';
}

const PartnerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 2450,
    monthlyEarnings: 1500,
    activeReferrals: 3,
    completedReferrals: 7,
    conversionRate: 68,
    currentTier: 'Silver Partner',
    nextTierProgress: 65
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'payment_received',
      title: 'Payment Received',
      description: 'Commission for TechCorp referral',
      amount: 500,
      timestamp: '2 hours ago',
      status: 'success'
    },
    {
      id: '2',
      type: 'referral_approved',
      title: 'Referral Approved',
      description: 'StartupXYZ project approved',
      amount: 750,
      timestamp: '1 day ago',
      status: 'success'
    },
    {
      id: '3',
      type: 'referral_submitted',
      title: 'New Referral Submitted',
      description: 'LocalBiz consultation request',
      timestamp: '2 days ago',
      status: 'pending'
    },
    {
      id: '4',
      type: 'tier_upgraded',
      title: 'Tier Upgrade',
      description: 'Promoted to Silver Partner',
      timestamp: '1 week ago',
      status: 'success'
    }
  ]);

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'payment_received':
        return <DollarSign className="w-4 h-4" />;
      case 'referral_approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'referral_submitted':
        return <Clock className="w-4 h-4" />;
      case 'tier_upgraded':
        return <Award className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'warning':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-white">Welcome back, John!</h1>
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            {stats.currentTier}
          </Badge>
        </div>
        <p className="text-gray-400">Here's what's happening with your partnership today.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Earnings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">£{stats.totalEarnings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">£{stats.monthlyEarnings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-orange-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        {/* Active Referrals */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Referrals</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeReferrals}</div>
            <div className="flex items-center text-xs text-blue-400 mt-1">
              <Clock className="w-3 h-3 mr-1" />
              In progress
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.conversionRate}%</div>
            <div className="flex items-center text-xs text-purple-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Above average
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <div className={`p-2 rounded-full bg-gray-600 ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium truncate">{activity.title}</h4>
                      {activity.amount && (
                        <span className="text-green-400 font-semibold">+£{activity.amount}</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm truncate">{activity.description}</p>
                    <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tier Progress & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Tier Progress */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-400" />
                Tier Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{stats.currentTier}</div>
                <div className="text-sm text-gray-400">Current Tier</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress to Gold</span>
                  <span className="text-white">{stats.nextTierProgress}%</span>
                </div>
                <Progress value={stats.nextTierProgress} className="h-2" />
              </div>
              
              <div className="text-xs text-gray-400 text-center">
                2 more successful referrals to reach Gold Partner
              </div>
              
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                View Tier Benefits
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Submit New Referral
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                Download Resources
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                Contact Support
              </Button>
            </CardContent>
          </Card>

          {/* Coming Soon Features */}
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-400">Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Target className="w-4 h-4 text-orange-400" />
                  Goal Tracking & Analytics
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Award className="w-4 h-4 text-orange-400" />
                  Achievement System
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Users className="w-4 h-4 text-orange-400" />
                  Team Collaboration Tools
                </div>
              </div>
              <Button variant="outline" className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PartnerDashboard; 