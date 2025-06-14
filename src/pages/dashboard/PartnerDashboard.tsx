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
  Star,
  Rocket,
  Zap,
  FileText,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ComingSoonSection } from '@/components/dashboard/ComingSoonSection';
import { PartnerLeaderboard } from '@/components/dashboard/PartnerLeaderboard';
import { PartnerOnboarding } from '@/components/dashboard/PartnerOnboarding';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AffiliateLayout } from '@/components/dashboard/AffiliateLayout';

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
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: 2450,
    monthlyEarnings: 1500,
    activeReferrals: 3,
    completedReferrals: 7,
    conversionRate: 68,
    currentTier: 'Silver Partner',
    nextTierProgress: 65
  });

  // Move recentActivity useState to top to fix hooks order
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

  // Check if partner has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Check if partner profile exists and is complete
        const { data: profile } = await supabase
          .from('partner_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile && profile.full_name && profile.network_description) {
          setIsOnboardingComplete(true);
        } else {
          setIsOnboardingComplete(false);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save or update partner profile
      const { error } = await supabase
        .from('partner_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          full_name: data.fullName,
          phone: data.phone,
          company: data.company,
          professional_background: data.professionalBackground,
          network_description: data.networkDescription,
          expected_monthly_referrals: data.expectedMonthlyReferrals,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving partner profile:', error);
        toast.error('Failed to save partner profile');
        return;
      }

      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  const handleOnboardingSkip = () => {
    setIsOnboardingComplete(true);
    toast.info('You can complete your profile later from settings');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show onboarding if not complete (temporarily disabled to show new dashboard)
  if (false && isOnboardingComplete === false) {
    return (
      <div className="p-6">
        <PartnerOnboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </div>
    );
  }

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
    <AffiliateLayout 
      title="Partner Dashboard"
      subtitle="Here's what's happening with your partnership today"
    >
      <div className="space-y-6 sm:space-y-8">
      {/* Current Tier Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-end"
      >
        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
          {stats.currentTier}
        </Badge>
      </motion.div>

      {/* Coming Soon Section - Featured prominently */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <ComingSoonSection />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Total Earnings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">£{stats.totalEarnings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">This Month</CardTitle>
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">£{stats.monthlyEarnings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-orange-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        {/* Active Referrals */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Active Referrals</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.activeReferrals}</div>
            <div className="flex items-center text-xs text-blue-400 mt-1">
              <Clock className="w-3 h-3 mr-1" />
              In progress
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.conversionRate}%</div>
            <div className="flex items-center text-xs text-purple-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +5% from last month
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column - Recent Activity & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-orange-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className={cn(
                      'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      getStatusColor(activity.status)
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-sm sm:text-base font-medium text-white truncate">
                          {activity.title}
                        </h4>
                        {activity.amount && (
                          <span className="text-sm font-bold text-green-400 mt-1 sm:mt-0">
                            +£{activity.amount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tier Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-orange-500" />
                  Progress to Gold Partner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <span className="text-sm text-gray-400">Current Progress</span>
                  <span className="text-sm font-medium text-white">{stats.nextTierProgress}% Complete</span>
                </div>
                <Progress value={stats.nextTierProgress} className="h-2 sm:h-3" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-white">{stats.completedReferrals}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-orange-400">3</div>
                    <div className="text-xs sm:text-sm text-gray-400">Needed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-green-400">£500</div>
                    <div className="text-xs sm:text-sm text-gray-400">Bonus</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <PartnerLeaderboard />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-white flex items-center">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-orange-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white h-12 sm:h-14 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                New Referral
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12 sm:h-14 text-sm sm:text-base">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                View Templates
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12 sm:h-14 text-sm sm:text-base">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 h-12 sm:h-14 text-sm sm:text-base">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Achievements
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </AffiliateLayout>
  );
};

export default PartnerDashboard; 