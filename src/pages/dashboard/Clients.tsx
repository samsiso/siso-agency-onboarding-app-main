import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Users, 
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Eye,
  MousePointer,
  Clock,
  CheckCircle,
  ExternalLink,
  FileText,
  Linkedin,
  Instagram,
  Network,
  UserPlus,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PartnershipLayout } from '@/components/partnership/PartnershipLayout';
import { PartnershipReferralsTable } from '@/components/partnership/PartnershipReferralsTable';
import { DashboardGreetingCard } from '@/components/ui/dashboard-templates';

export default function Clients() {
  const navigate = useNavigate();
  
  // Commission and referral data
  const quickStats = {
    totalCommission: 2450,
    activeReferrals: 3,
    conversionRate: 68,
    pipelineValue: 75650
  };

  const performanceData = [
    { period: 'Jan 2025', revenue: 1200, leads: 45, conversions: 8 },
    { period: 'Dec 2024', revenue: 980, leads: 38, conversions: 6 },
    { period: 'Nov 2024', revenue: 1450, leads: 52, conversions: 12 },
    { period: 'Oct 2024', revenue: 890, leads: 34, conversions: 5 },
    { period: 'Sep 2024', revenue: 1100, leads: 41, conversions: 9 }
  ];

  const partnershipChannels = [
    { 
      name: 'Internal Network', 
      icon: Network,
      clients: 12, 
      conversions: 8, 
      revenue: 12000,
      conversionRate: 67,
      sopPath: '/partner/sop/internal-network'
    },
    { 
      name: 'LinkedIn Outreach', 
      icon: Linkedin,
      clients: 18, 
      conversions: 5, 
      revenue: 8000,
      conversionRate: 28,
      sopPath: '/partner/sop/linkedin-outreach'
    },
    { 
      name: 'Social Media', 
      icon: Instagram,
      clients: 8, 
      conversions: 2, 
      revenue: 3000,
      conversionRate: 25,
      sopPath: '/partner/sop/social-media'
    },
    { 
      name: 'Direct Referrals', 
      icon: UserPlus,
      clients: 5, 
      conversions: 4, 
      revenue: 15000,
      conversionRate: 80,
      sopPath: '/partner/sop/direct-referrals'
    }
  ];

  const handleChannelClick = (sopPath: string) => {
    // Navigate to SOP page
    navigate(sopPath);
  };

  return (
    <PartnershipLayout>
      <div className="space-y-8">
        {/* Smart Dashboard Greeting Card - New Header */}
        <DashboardGreetingCard 
          pageTitle="Client Management Hub"
          pageSubtitle="Your partnership revenue engine - track referrals & commissions"
          showDate={true}
          pageContext={{
            pageType: 'clients',
            keyMetrics: {
              primary: { value: '12', label: 'Active Clients', trend: '+2' },
              secondary: { value: '89%', label: 'Satisfaction Rate' }
            },
            urgentItems: 3
          }}
        />
        {/* Quick Stats Bar - Most Important Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£{quickStats.totalCommission.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12% this month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Referrals</CardTitle>
              <Users className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{quickStats.activeReferrals}</div>
              <div className="flex items-center text-sm text-orange-400">
                <Clock className="h-3 w-3 mr-1" />
                In progress
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{quickStats.conversionRate}%</div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5% vs last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pipeline Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£{quickStats.pipelineValue.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +18% potential
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Referrals Table - Primary Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Users className="h-6 w-6 mr-2 text-orange-500" />
                Client Referrals
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Manage your client referrals and track commission opportunities
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <PartnershipReferralsTable />
            </CardContent>
          </Card>
        </motion.div>

        {/* Partnership Channels - Updated "Top Sources" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Network className="h-6 w-6 mr-2 text-orange-500" />
                Partnership Channels
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Track performance by channel and access SOPs for each method
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnershipChannels.map((channel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleChannelClick(channel.sopPath)}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-900 border border-orange-500/10 rounded-lg hover:border-orange-500/30 transition-all duration-200 group-hover:bg-gray-800">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                          <channel.icon className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium group-hover:text-orange-300 transition-colors">
                            {channel.name}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-400">
                            <span>{channel.clients} clients</span>
                            <span>{channel.conversions} conversions</span>
                            <span>{channel.conversionRate}% rate</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">£{channel.revenue.toLocaleString()}</div>
                        <div className="flex items-center text-sm text-orange-400 group-hover:text-orange-300">
                          <FileText className="h-3 w-3 mr-1" />
                          View SOP
                          <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Performance Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Monthly Revenue Trend */}
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
                  Revenue Trend
                </div>
                <div className="text-sm text-green-400 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +18%
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => {
                  const maxRevenue = Math.max(...performanceData.map(d => d.revenue));
                  const widthPercentage = (item.revenue / maxRevenue) * 100;
                  const isLatest = index === 0;
                  
                  return (
                    <div key={index} className={`relative ${isLatest ? 'bg-orange-500/10 p-3 rounded-lg border border-orange-500/20' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isLatest ? 'text-orange-300' : 'text-gray-400'}`}>
                          {item.period}
                        </span>
                        <div className="text-right">
                          <span className={`text-sm font-medium ${isLatest ? 'text-white' : 'text-gray-300'}`}>
                            £{item.revenue.toLocaleString()}
                          </span>
                          <div className="text-xs text-gray-500">
                            {item.leads} leads • {item.conversions} converted
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className={`h-3 rounded-full ${isLatest ? 'bg-orange-500' : 'bg-orange-500/60'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPercentage}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                      {isLatest && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Conversion Funnel */}
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center justify-between">
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-orange-500" />
                  Conversion Funnel
                </div>
                <div className="text-sm text-orange-400">
                  21% Rate
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Total Contacts', value: 43, icon: Eye, color: 'blue', percentage: 100 },
                  { label: 'Qualified Leads', value: 29, icon: MousePointer, color: 'yellow', percentage: 67 },
                  { label: 'Proposals Sent', value: 15, icon: FileText, color: 'orange', percentage: 52 },
                  { label: 'MVPs Created', value: 12, icon: CheckCircle, color: 'purple', percentage: 80 },
                  { label: 'Conversions', value: 9, icon: TrendingUp, color: 'green', percentage: 75 }
                ].map((stage, index) => {
                  const getColorClasses = (color: string) => {
                    const colors = {
                      blue: 'text-blue-400 bg-blue-500/20',
                      yellow: 'text-yellow-400 bg-yellow-500/20',
                      orange: 'text-orange-400 bg-orange-500/20',
                      purple: 'text-purple-400 bg-purple-500/20',
                      green: 'text-green-400 bg-green-500/20'
                    };
                    return colors[color as keyof typeof colors] || colors.blue;
                  };

                  return (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getColorClasses(stage.color)}`}>
                            <stage.icon className="h-4 w-4" />
                          </div>
                          <span className="text-gray-300 text-sm">{stage.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-medium">{stage.value}</span>
                          <div className="text-xs text-gray-500">
                            {stage.percentage}% of prev
                          </div>
                        </div>
                      </div>
                      {index < 4 && (
                        <div className="ml-4 mt-2 mb-2">
                          <div className="w-0.5 h-6 bg-gray-700"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-orange-500" />
                Channel Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnershipChannels.map((channel, index) => {
                  const maxRevenue = Math.max(...partnershipChannels.map(c => c.revenue));
                  const revenuePercentage = (channel.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <channel.icon className="h-4 w-4 text-orange-400" />
                          <span className="text-gray-300 text-sm">{channel.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium text-sm">
                            £{(channel.revenue / 1000).toFixed(0)}k
                          </div>
                          <div className="text-xs text-gray-500">
                            {channel.conversionRate}% rate
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <motion.div 
                            className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${revenuePercentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round(revenuePercentage)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PartnershipLayout>
  );
}