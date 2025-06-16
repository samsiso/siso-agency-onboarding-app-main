import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Eye,
  MousePointer,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AffiliateLayout } from '@/components/dashboard/AffiliateLayout';

export default function Statistics() {
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with real API calls
  const kpiData = {
    totalRevenue: 2450,
    conversionRate: 12.5,
    avgDealValue: 245,
    growthRate: 18.2,
    totalClicks: 1247,
    totalLeads: 89,
    activeDeals: 15,
    pipelineValue: 7650
  };

  const performanceData = [
    { period: 'Jan 2025', revenue: 1200, leads: 45, conversions: 8 },
    { period: 'Dec 2024', revenue: 980, leads: 38, conversions: 6 },
    { period: 'Nov 2024', revenue: 1450, leads: 52, conversions: 12 },
    { period: 'Oct 2024', revenue: 890, leads: 34, conversions: 5 },
    { period: 'Sep 2024', revenue: 1100, leads: 41, conversions: 9 }
  ];

  const topSources = [
    { source: 'LinkedIn Outreach', clicks: 345, conversions: 12, revenue: 1200 },
    { source: 'Email Signature', clicks: 289, conversions: 8, revenue: 800 },
    { source: 'Spring Campaign', clicks: 234, conversions: 6, revenue: 600 },
    { source: 'Direct Referrals', clicks: 189, conversions: 4, revenue: 400 }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleExport = (format: string) => {
    // Implement export functionality
    console.log(`Exporting data as ${format}`);
  };

  return (
    <AffiliateLayout
      title="Performance Statistics"
      subtitle="Comprehensive analytics and performance insights"
      actions={
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 bg-black border-orange-500/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-orange-500/20">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-orange-500/30 text-gray-300 hover:bg-orange-500/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Select onValueChange={handleExport}>
            <SelectTrigger className="w-24 bg-black border-orange-500/20 text-white">
              <Download className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-black border-orange-500/20">
              <SelectItem value="pdf">Export PDF</SelectItem>
              <SelectItem value="csv">Export CSV</SelectItem>
              <SelectItem value="excel">Export Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£{kpiData.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +{kpiData.growthRate}% vs last period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpiData.conversionRate}%</div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.3% vs last period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Avg Deal Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£{kpiData.avgDealValue}</div>
              <div className="flex items-center text-sm text-red-400">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -1.2% vs last period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pipeline Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£{kpiData.pipelineValue.toLocaleString()}</div>
              <div className="flex items-center text-sm text-green-400">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.7% vs last period
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <LineChart className="h-6 w-6 mr-2 text-orange-500" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-400">{item.period}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-medium">£{item.revenue}</span>
                      <div className="w-20 bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${(item.revenue / 1500) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <PieChart className="h-6 w-6 mr-2 text-orange-500" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-gray-400">Total Clicks</span>
                  </div>
                  <span className="text-white font-medium">{kpiData.totalClicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MousePointer className="h-4 w-4 mr-2 text-yellow-400" />
                    <span className="text-gray-400">Leads Generated</span>
                  </div>
                  <span className="text-white font-medium">{kpiData.totalLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-orange-400" />
                    <span className="text-gray-400">Active Deals</span>
                  </div>
                  <span className="text-white font-medium">{kpiData.activeDeals}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    <span className="text-gray-400">Conversions</span>
                  </div>
                  <span className="text-white font-medium">23</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Performing Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-black border-orange-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-orange-500" />
                Top Performing Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900 border border-orange-500/10 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{source.source}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                        <span>{source.clicks} clicks</span>
                        <span>{source.conversions} conversions</span>
                        <span>{((source.conversions / source.clicks) * 100).toFixed(1)}% rate</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">£{source.revenue}</div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AffiliateLayout>
  );
}