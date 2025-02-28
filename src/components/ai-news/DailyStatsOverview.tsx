
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Database, BarChart4, PieChart, LineChart } from 'lucide-react';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { useMemo } from 'react';
import { NewsItem } from '@/types/blog';

// [Analysis] Type definitions for props to ensure type safety
interface DailyStatsOverviewProps {
  newsItems: NewsItem[];
  lastSync: string | null;
  articleCount: number;
}

// [Analysis] Color schemes for charts to maintain visual consistency
const COLORS = ['#ff4b4b', '#ff7425', '#ffaa40', '#4b9eff', '#4bffb8'];
const gradientId = "statsCardGradient";

export function DailyStatsOverview({ newsItems, lastSync, articleCount }: DailyStatsOverviewProps) {
  // [Analysis] Calculate statistics from news items for data visualization
  const stats = useMemo(() => {
    // Count articles by category
    const categoryMap: Record<string, number> = {};
    const impactMap: Record<string, number> = {};
    
    newsItems.forEach(item => {
      // Process categories
      if (item.category) {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + 1;
      }
      
      // Process impact levels
      if (item.impact) {
        impactMap[item.impact] = (impactMap[item.impact] || 0) + 1;
      }
    });
    
    // Convert to chart data format
    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    const impactData = Object.entries(impactMap).map(([name, value]) => ({ name, value }));
    
    // Generate source distribution data (simulated since we don't have this in the data)
    const sourceData = [
      { name: 'News API', value: Math.floor(newsItems.length * 0.4) },
      { name: 'Event Registry', value: Math.floor(newsItems.length * 0.35) },
      { name: 'RSS Feeds', value: Math.floor(newsItems.length * 0.25) },
    ];

    return {
      categoryData,
      impactData,
      sourceData,
      totalItems: newsItems.length,
    };
  }, [newsItems]);

  return (
    <div className="w-full">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4b4b" />
            <stop offset="100%" stopColor="#ffaa40" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="mb-6">
        <GradientHeading variant="sunset" size="md">Today's AI News Insights</GradientHeading>
        <p className="text-muted-foreground">
          Last updated: {lastSync || 'Never'} • {articleCount} articles this month
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-siso-orange" />
                <span>Top Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.categoryData.slice(0, 5).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={index < 3 ? "default" : "outline"} className="capitalize">
                        {category.name.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <span className="text-sm font-medium">{category.value} articles</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-siso-orange" />
                <span>Impact Levels</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={stats.impactData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {stats.impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} articles`, 'Count']} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-siso-orange" />
                <span>Source Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.sourceData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value) => [`${value} articles`, 'Count']}
                      contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
                    />
                    <Bar dataKey="value" fill="url(#statsCardGradient)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Additional Insights */}
      <motion.div 
        className="w-full" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart4 className="h-5 w-5 text-siso-orange" />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={120}
                    tickFormatter={(value) => value.replace(/_/g, ' ')}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} articles`, 'Count']}
                    contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none' }}
                  />
                  <Bar dataKey="value" fill="url(#statsCardGradient)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
