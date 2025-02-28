
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Database, BarChart4, PieChart, LineChart } from 'lucide-react';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';
import { useMemo } from 'react';
import { NewsItem } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';

// [Analysis] Type definitions for props to ensure type safety
interface DailyStatsOverviewProps {
  newsItems: NewsItem[];
  lastSync: string | null;
  articleCount: number;
  loading?: boolean;
}

// [Analysis] Color schemes for charts to maintain visual consistency
const COLORS = ['#ff4b4b', '#ff7425', '#ffaa40', '#4b9eff', '#4bffb8'];
const gradientId = "statsCardGradient";

export function DailyStatsOverview({ newsItems, lastSync, articleCount, loading = false }: DailyStatsOverviewProps) {
  console.log('Rendering DailyStatsOverview with', newsItems.length, 'news items');
  console.log('Last sync:', lastSync);
  console.log('Article count:', articleCount);
  console.log('Loading state:', loading);
  
  // [Analysis] Calculate statistics from news items for data visualization
  const stats = useMemo(() => {
    if (loading || !newsItems.length) {
      console.log('Stats calculation skipped - loading or no items');
      return {
        categoryData: [],
        impactData: [],
        sourceData: [],
        totalItems: 0
      };
    }
    
    console.log('Calculating stats from news items:', newsItems);
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

    console.log('Generated stats:', { categoryData, impactData, sourceData });

    return {
      categoryData,
      impactData,
      sourceData,
      totalItems: newsItems.length,
    };
  }, [newsItems, loading]);

  if (loading) {
    return <StatsLoadingState />;
  }

  if (!newsItems.length) {
    return (
      <div className="w-full p-6 text-center">
        <GradientHeading variant="sunset" size="md">No Data Available</GradientHeading>
        <p className="text-muted-foreground mt-2">
          There are no news items to display statistics for. Try syncing news data first.
        </p>
      </div>
    );
  }

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
                {stats.categoryData.length > 0 ? (
                  stats.categoryData.slice(0, 5).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={index < 3 ? "default" : "outline"} className="capitalize">
                          {category.name.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{category.value} articles</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No category data available
                  </div>
                )}
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
                {stats.impactData.length > 0 ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No impact data available
                  </div>
                )}
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
                {stats.sourceData.length > 0 ? (
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No source data available
                  </div>
                )}
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
              {stats.categoryData.length > 0 ? (
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
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No category data available for visualization
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// [Analysis] Loading state component for better UX during data fetch
function StatsLoadingState() {
  return (
    <div className="w-full">
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[260px]">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-[180px] w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
