import { GraduationCap, Video, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { cn } from '@/lib/utils';

interface StatsDisplayProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
}

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  const statCards = [
    {
      icon: GraduationCap,
      label: "Total Educators",
      value: stats.totalEducators,
      gradient: "from-siso-red via-siso-orange to-siso-red",
      iconColor: "text-siso-red",
      delay: 0
    },
    {
      icon: Video,
      label: "Total Videos",
      value: stats.totalVideos,
      gradient: "from-blue-500 via-purple-500 to-blue-500",
      iconColor: "text-blue-500",
      delay: 0.1
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      gradient: "from-green-500 via-emerald-500 to-green-500",
      iconColor: "text-green-500",
      delay: 0.2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className={cn(
              "p-6 rounded-xl border border-siso-border",
              "bg-gradient-to-br backdrop-blur-sm bg-opacity-10",
              "hover:shadow-lg hover:scale-[1.02] hover:border-opacity-50",
              "transition-all duration-300 ease-out",
              "group relative overflow-hidden"
            )}
          >
            {/* Animated gradient background */}
            <div 
              className={cn(
                "absolute inset-0 bg-gradient-to-r opacity-10 group-hover:opacity-20",
                "animate-gradient bg-[length:200%_200%]",
                stat.gradient
              )}
              style={{ '--animation-duration': '8s' } as React.CSSProperties}
            />

            <div className="relative flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-lg bg-white/5 backdrop-blur-sm",
                "group-hover:scale-110 group-hover:rotate-6",
                "transition-all duration-300 ease-out"
              )}>
                <Icon className={cn("w-6 h-6", stat.iconColor)} />
              </div>
              <div>
                <motion.div 
                  className="text-2xl font-bold text-siso-text-bold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <CountUp
                    end={stat.value}
                    duration={2}
                    separator=","
                    useEasing={true}
                  />
                </motion.div>
                <div className="text-siso-text/60 text-sm group-hover:text-siso-text/80 transition-colors">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};