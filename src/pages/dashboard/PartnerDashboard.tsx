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
  Lightbulb,
  Play,
  Trophy,
  Activity,
  Brain,
  ExternalLink,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Video,
  Download
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

      {/* Enhanced Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Training Hub - Premium Learning Experience Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="bg-black/60 backdrop-blur-xl border-green-500/20 shadow-2xl hover:border-green-500/40 transition-all overflow-hidden">
            <div className="relative">
              {/* Hero Image Header */}
              <div className="relative h-32 bg-gradient-to-br from-green-600/30 via-emerald-500/20 to-teal-500/30 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.3),transparent_50%)]"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-500/30 text-green-300 border-green-500/40 backdrop-blur-sm">
                    🎓 Learning Hub
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                      <GraduationCap className="h-5 w-5 text-green-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Training & Development</h3>
                      <p className="text-sm text-green-200">Partner Success Mastery</p>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Featured Learning Path Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-yellow-400">Recommended Path</span>
                    </div>
                    <span className="text-xs text-gray-400">60% Complete</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3">
                    <h4 className="text-white font-medium mb-2">🚀 Partner Success Mastery</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                        <span className="text-green-300">Referral Strategies</span>
                        <Badge className="bg-green-500/20 text-green-400 text-xs ml-auto">✅</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Play className="h-3 w-3 text-orange-400" />
                        <span className="text-orange-300">Client Communication</span>
                        <Badge className="bg-orange-500/20 text-orange-400 text-xs ml-auto">📚</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-400">Closing Techniques</span>
                        <Badge className="bg-gray-500/20 text-gray-400 text-xs ml-auto">🔒</Badge>
                      </div>
                    </div>
                    <Progress value={60} className="h-2 mt-3" />
                  </div>
                </div>

                {/* Course Categories Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Course Categories</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = '/partner/training-hub'}
                      className="text-green-400 hover:bg-green-500/10 h-6 px-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium text-white group-hover:text-orange-100">Sales & Marketing</span>
                      </div>
                      <div className="text-xs text-gray-400">8 courses</div>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-white group-hover:text-blue-100">Technical Skills</span>
                      </div>
                      <div className="text-xs text-gray-400">12 courses</div>
                    </div>
                    
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium text-white group-hover:text-purple-100">Client Relations</span>
                      </div>
                      <div className="text-xs text-gray-400">5 courses</div>
                    </div>
                    
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm font-medium text-white group-hover:text-cyan-100">Tools & Resources</span>
                      </div>
                      <div className="text-xs text-gray-400">15 courses</div>
                    </div>
                  </div>
                </div>

                {/* Learning Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-lg font-bold text-green-400">12</div>
                    <div className="text-xs text-gray-400">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="text-lg font-bold text-orange-400">48</div>
                    <div className="text-xs text-gray-400">Hours</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">3</div>
                    <div className="text-xs text-gray-400">Certificates</div>
                  </div>
                </div>

                {/* Upcoming Webinar Preview */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Next Live Session</span>
                    <Badge className="bg-red-500/20 text-red-400 text-xs ml-auto">🔴 LIVE</Badge>
                  </div>
                  <div className="text-sm text-white font-medium">Advanced Referral Strategies</div>
                  <div className="text-xs text-gray-400">Jan 28 • 2:00 PM • Sarah Johnson</div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.location.href = '/partner/training-hub'}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => window.location.href = '/partner/training-hub'}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Resources
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>

        {/* Leaderboard Preview - Rich Data Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-black/60 backdrop-blur-xl border-purple-500/20 shadow-2xl hover:border-purple-500/40 transition-all">
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
                    <p className="text-sm text-gray-400">Your position: #5 of 8</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Silver Tier
                </Badge>
              </div>

              {/* Mini Leaderboard */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">1</div>
                    <span className="text-sm text-white">Sarah Johnson</span>
                  </div>
                  <span className="text-sm text-green-400">£15,420</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-black">2</div>
                    <span className="text-sm text-white">Michael Chen</span>
                  </div>
                  <span className="text-sm text-green-400">£12,350</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">5</div>
                    <span className="text-sm text-orange-400 font-medium">You</span>
                  </div>
                  <span className="text-sm text-green-400">£8,750</span>
                </div>
              </div>

              {/* Progress to Next Tier */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress to Gold</span>
                  <span className="text-white">£1,250 more needed</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              {/* Action Button */}
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.location.href = '/partner/leaderboard'}
              >
                <Trophy className="h-4 w-4 mr-2" />
                View Full Rankings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Management - Rich Data Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="bg-black/60 backdrop-blur-xl border-blue-500/20 shadow-2xl hover:border-blue-500/40 transition-all">
            <CardContent className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Client Management</h3>
                    <p className="text-sm text-gray-400">Track relationships & engagement</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/partner/clients'}
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>

              {/* Client Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">12</div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
                <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-xl font-bold text-green-400">8</div>
                  <div className="text-xs text-gray-400">Converted</div>
                </div>
                <div className="text-center p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="text-xl font-bold text-orange-400">3</div>
                  <div className="text-xs text-gray-400">Pending</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-medium">Recent Activity:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-white">TechCorp signed contract</span>
                    </div>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm text-white">StartupXYZ meeting scheduled</span>
                    </div>
                    <span className="text-xs text-gray-400">1d ago</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => window.location.href = '/partner/clients'}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View All
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                  onClick={() => window.location.href = '/partner/referrals'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support Center - Image Card with Rich Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-black/60 backdrop-blur-xl border-orange-500/20 shadow-2xl hover:border-orange-500/40 transition-all overflow-hidden">
            <div className="relative">
              {/* Header with Background Pattern */}
              <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 p-6 border-b border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Support Center</h3>
                      <p className="text-sm text-gray-400">Get help when you need it</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    24/7 Available
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                {/* Support Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg hover:bg-orange-500/10 transition-colors cursor-pointer">
                    <MessageSquare className="h-5 w-5 text-orange-400 mb-2" />
                    <div className="text-sm font-medium text-white">Live Chat</div>
                    <div className="text-xs text-gray-400">Instant help</div>
                  </div>
                  <div className="p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg hover:bg-orange-500/10 transition-colors cursor-pointer">
                    <FileText className="h-5 w-5 text-orange-400 mb-2" />
                    <div className="text-sm font-medium text-white">Knowledge Base</div>
                    <div className="text-xs text-gray-400">Self-service</div>
                  </div>
                  <div className="p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg hover:bg-orange-500/10 transition-colors cursor-pointer">
                    <Video className="h-5 w-5 text-orange-400 mb-2" />
                    <div className="text-sm font-medium text-white">Video Guides</div>
                    <div className="text-xs text-gray-400">Step-by-step</div>
                  </div>
                  <div className="p-3 bg-gray-900/50 border border-gray-700/30 rounded-lg hover:bg-orange-500/10 transition-colors cursor-pointer">
                    <Download className="h-5 w-5 text-orange-400 mb-2" />
                    <div className="text-sm font-medium text-white">Resources</div>
                    <div className="text-xs text-gray-400">Templates & tools</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">&lt; 2min</div>
                    <div className="text-xs text-gray-400">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">98%</div>
                    <div className="text-xs text-gray-400">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">24/7</div>
                    <div className="text-xs text-gray-400">Available</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => window.location.href = '/partner/support'}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Support Now
                </Button>
              </CardContent>
            </div>
          </Card>
        </motion.div>

      </div>

      </div>
    </PartnershipLayout>
  );
};

export default PartnerDashboard; 