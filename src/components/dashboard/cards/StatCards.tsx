import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen, DollarSign, CheckSquare, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { useMainUserProject } from '@/hooks/useUserProjects';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardData {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  gradient: string;
  iconBg: string;
  textColor: string;
  borderColor: string;
}

const StatCard = ({ data, index }: { data: StatCardData; index: number }) => {
  const IconComponent = data.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        data.gradient
      )}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-50" />
        
        {/* Glow effect on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-r",
          data.borderColor.replace('border-', 'from-').replace('/20', '/30') + ' to-transparent'
        )} />
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-3 rounded-xl shadow-lg",
                  data.iconBg
                )}>
                  <IconComponent className={cn("h-6 w-6", data.textColor)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/70">{data.title}</p>
                  <p className="text-2xl font-bold text-white">{data.value}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-white/60">{data.subtitle}</p>
                
                {data.trend && (
                  <div className="flex items-center gap-2">
                    {data.trend.isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      data.trend.isPositive ? "text-green-400" : "text-red-400"
                    )}>
                      {data.trend.isPositive ? '+' : ''}{data.trend.value}%
                    </span>
                    <span className="text-xs text-white/50">{data.trend.period}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="relative">
              <div className={cn(
                "w-20 h-20 rounded-full opacity-10",
                data.iconBg
              )} />
              <IconComponent className={cn(
                "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 opacity-20",
                data.textColor
              )} />
            </div>
          </div>
          
          {/* Progress bar for certain metrics */}
          {data.id === 'satisfaction' && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-xs text-white/60 mb-2">
                <span>Rating Progress</span>
                <span>4.8/5.0</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: '96%' }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function StatCards() {
  const { project, hasProjects, loading } = useMainUserProject();
  
  // Calculate task count (you can enhance this with real data)
  const taskCount = hasProjects ? 0 : 3; // Show 3 workflow tasks if no projects

  const statsData: StatCardData[] = [
    {
      id: 'projects',
      title: 'Active Projects',
      value: hasProjects ? '1' : '0',
      subtitle: hasProjects ? 'project in development' : 'projects',
      icon: FolderOpen,
      trend: {
        value: hasProjects ? 100 : 0,
        isPositive: true,
        period: 'vs last month'
      },
      gradient: 'from-blue-600/20 via-blue-500/10 to-cyan-500/20',
      iconBg: 'bg-blue-500/20 border border-blue-400/30',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20'
    },
    {
      id: 'revenue',
      title: 'Revenue This Month',
      value: '£12,450',
      subtitle: 'vs last month',
      icon: DollarSign,
      trend: {
        value: 28,
        isPositive: true,
        period: '+28%'
      },
      gradient: 'from-green-600/20 via-green-500/10 to-emerald-500/20',
      iconBg: 'bg-green-500/20 border border-green-400/30',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/20'
    },
    {
      id: 'tasks',
      title: 'Pending Tasks',
      value: taskCount,
      subtitle: 'tasks remaining',
      icon: CheckSquare,
      trend: taskCount > 0 ? {
        value: -15,
        isPositive: false,
        period: 'completion rate'
      } : undefined,
      gradient: 'from-orange-600/20 via-orange-500/10 to-amber-500/20',
      iconBg: 'bg-orange-500/20 border border-orange-400/30',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/20'
    },
    {
      id: 'satisfaction',
      title: 'Client Satisfaction',
      value: '4.8★',
      subtitle: 'average rating',
      icon: Star,
      trend: {
        value: 5,
        isPositive: true,
        period: 'this quarter'
      },
      gradient: 'from-purple-600/20 via-purple-500/10 to-pink-500/20',
      iconBg: 'bg-purple-500/20 border border-purple-400/30',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-black/30 border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={stat.id} data={stat} index={index} />
      ))}
    </div>
  );
} 