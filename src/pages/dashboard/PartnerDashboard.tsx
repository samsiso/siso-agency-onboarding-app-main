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
  BarChart3,
  BookOpen,
  HelpCircle,
  User,
  Plus,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PartnerOnboarding } from '@/components/dashboard/PartnerOnboarding';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PartnershipLayout } from '@/components/partnership/PartnershipLayout';
import { DashboardGreetingCard } from '@/components/ui/dashboard-templates';
import { useUser } from '@/hooks/useUser';
import { AppPlanMicroChat } from '@/components/dashboard/AppPlanMicroChat';

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
  const { user } = useUser();
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

  // Define leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'Sarah Johnson', tier: 'Platinum', referrals: 28, earnings: 15420, badges: ['🎯', '🏆', '💎'] },
    { rank: 2, name: 'Michael Chen', tier: 'Gold', referrals: 22, earnings: 12350, badges: ['🎯', '🏆'] },
    { rank: 3, name: 'Emma Rodriguez', tier: 'Gold', referrals: 19, earnings: 11200, badges: ['🎯', '💎'] },
    { rank: 4, name: 'James Wilson', tier: 'Gold', referrals: 18, earnings: 10980, badges: ['🎯', '🏆', '💎'] },
    { rank: 5, name: 'You', tier: 'Silver', referrals: 15, earnings: 8750, badges: ['🎯', '🏆'], isCurrentUser: true },
    { rank: 6, name: 'David Kim', tier: 'Silver', referrals: 13, earnings: 7890, badges: ['🎯', '🏆'] },
    { rank: 7, name: 'Anna Martinez', tier: 'Silver', referrals: 11, earnings: 6750, badges: ['🎯', '🏆'] },
    { rank: 8, name: 'Lisa Thompson', tier: 'Bronze', referrals: 8, earnings: 4560, badges: ['🎯'] }
  ];

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
    <PartnershipLayout 
      title="Partner Dashboard"
      subtitle="Here's what's happening with your partnership today"
    >
      <div className="space-y-6 sm:space-y-8">
      
      {/* Dashboard Greeting Card */}
      <DashboardGreetingCard 
        userName={user?.email?.split('@')[0] || user?.user_metadata?.full_name}
        welcomeMessage="Welcome to your partnership dashboard"
        showDate={true}
      />

      {/* App Plan Micro Chat */}
      <AppPlanMicroChat 
        onNavigateToFullBuilder={() => window.location.href = '/partner/app-plan-generator'}
      />


      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Total Earnings */}
        <Card className="bg-black border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">£{stats.totalEarnings.toLocaleString()}</div>
            <div className="flex items-center text-xs text-orange-400 mt-1">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings */}
        <Card className="bg-black border-orange-500/20">
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
        <Card className="bg-black border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Active Referrals</CardTitle>
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.activeReferrals}</div>
            <div className="flex items-center text-xs text-orange-400 mt-1">
              <Clock className="w-3 h-3 mr-1" />
              In progress
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="bg-black border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.conversionRate}%</div>
            <div className="flex items-center text-xs text-orange-400 mt-1">
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
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-black border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-white flex items-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-orange-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-orange-500/10 transition-colors">
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
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-black border-orange-500/20">
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
                  <div className="text-center p-3 bg-gray-900 border border-orange-500/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-white">{stats.completedReferrals}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900 border border-orange-500/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-orange-400">3</div>
                    <div className="text-xs sm:text-sm text-gray-400">Needed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-900 border border-orange-500/20 rounded-lg">
                    <div className="text-lg sm:text-xl font-bold text-orange-400">£500</div>
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="lg:col-span-1"
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-500" />
                  Partner Leaderboard
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  #5
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">#5</div>
                  <div className="text-xs text-gray-400">Your Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">8</div>
                  <div className="text-xs text-gray-400">Total Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">Silver</div>
                  <div className="text-xs text-gray-400">Your Tier</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {leaderboardData.slice(0, 5).map((partner) => (
                  <div 
                    key={partner.rank} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      partner.isCurrentUser 
                        ? "bg-orange-500/10 border-orange-500/30" 
                        : "bg-gray-900/50 border-gray-700/30 hover:bg-gray-800/50"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "text-sm font-bold flex items-center justify-center w-6 h-6 rounded-full",
                        partner.rank <= 3 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"
                      )}>
                        #{partner.rank}
                      </div>
                      <div>
                        <div className={cn(
                          "text-sm font-medium",
                          partner.isCurrentUser ? "text-orange-400" : "text-white"
                        )}>
                          {partner.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {partner.tier} • {partner.referrals} referrals
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-400">
                        £{partner.earnings.toLocaleString()}
                      </div>
                      <div className="flex space-x-1">
                        {partner.badges.map((badge, idx) => (
                          <span key={idx} className="text-xs">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                onClick={() => window.location.href = '/partner/leaderboard'}
              >
                View Full Rankings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Help Center */}
        <Card className="bg-black border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer"
              onClick={() => window.location.href = '/partner/support'}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                <HelpCircle className="h-4 w-4 text-orange-400" />
              </div>
              Help Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-4">
              Get support, access guides, and connect with our team for assistance.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/partner/support';
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Get Help
            </Button>
          </CardContent>
        </Card>

        {/* New Client Referral */}
        <Card className="bg-black border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer"
              onClick={() => window.location.href = '/partner/referrals'}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                <Plus className="h-4 w-4 text-orange-400" />
              </div>
              New Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-4">
              Submit a new client referral and start earning commissions.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = '/partner/referrals';
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              Add Referral
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      </div>
    </PartnershipLayout>
  );
};

export default PartnerDashboard; 