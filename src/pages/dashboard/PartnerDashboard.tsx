import React from 'react';
import { PartnerLayout } from '../../components/dashboard/PartnerLayout';
import { ComingSoonSection } from '../../components/dashboard/ComingSoonSection';
import { PartnerLeaderboard } from '../../components/dashboard/PartnerLeaderboard';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ProgressTracker } from '../../components/dashboard/ProgressTracker';
import { 
  DollarSign, 
  Users, 
  Target, 
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

export function PartnerDashboard() {
  // Mock data - replace with actual data from API
  const stats = {
    monthlyEarnings: 0,
    totalReferrals: 0,
    conversionRate: 0,
    activeClients: 0
  };

  const nextMilestone = {
    current: 0,
    target: 5,
    label: 'First Referral Milestone',
    reward: '£50 Bonus'
  };

  return (
    <PartnerLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Partner Dashboard</h1>
            <p className="mt-1 text-gray-400">
              Welcome back! Track your performance and earnings.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Monthly Earnings"
            value={`£${stats.monthlyEarnings.toLocaleString()}`}
            icon={DollarSign}
            change={stats.monthlyEarnings > 0 ? '+0%' : '0%'}
            changeType="positive"
          />
          <StatsCard
            title="Total Referrals"
            value={stats.totalReferrals.toString()}
            icon={Users}
            change={stats.totalReferrals > 0 ? '+0%' : '0%'}
            changeType="neutral"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            icon={Target}
            change={stats.conversionRate > 0 ? '+0%' : '0%'}
            changeType="neutral"
          />
          <StatsCard
            title="Active Clients"
            value={stats.activeClients.toString()}
            icon={TrendingUp}
            change={stats.activeClients > 0 ? '+0%' : '0%'}
            changeType="neutral"
          />
        </div>

        {/* Progress Tracker */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Next Milestone</h2>
            <Award className="h-5 w-5 text-orange-500" />
          </div>
          <ProgressTracker
            current={nextMilestone.current}
            target={nextMilestone.target}
            label={nextMilestone.label}
            reward={nextMilestone.reward}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coming Soon Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ComingSoonSection />
          </div>

          {/* Leaderboard - Takes 1 column */}
          <div className="lg:col-span-1">
            <PartnerLeaderboard />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium transition-colors">
              <Users className="h-5 w-5 mr-2" />
              Find New Clients
            </button>
            <button className="flex items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">
              <Target className="h-5 w-5 mr-2" />
              View Resources
            </button>
            <button className="flex items-center justify-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors">
              <TrendingUp className="h-5 w-5 mr-2" />
              Track Progress
            </button>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
} 