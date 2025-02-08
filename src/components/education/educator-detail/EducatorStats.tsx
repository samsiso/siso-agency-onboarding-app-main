
import { Users, PlaySquare, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface EducatorStatsProps {
  subscriberCount?: number | null;
  videoCount?: number | null;
  totalViews?: number | null;
}

const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export const EducatorStats = ({ 
  subscriberCount, 
  videoCount, 
  totalViews 
}: EducatorStatsProps) => {
  const stats = [
    {
      icon: Users,
      label: "Subscribers",
      value: formatNumber(subscriberCount),
      color: "text-siso-orange",
      bgColor: "bg-siso-orange/10"
    },
    {
      icon: PlaySquare,
      label: "Videos",
      value: formatNumber(videoCount),
      color: "text-siso-red",
      bgColor: "bg-siso-red/10"
    },
    {
      icon: Eye,
      label: "Total Views",
      value: formatNumber(totalViews),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-br from-siso-bg-alt to-siso-bg-alt/50 backdrop-blur-sm rounded-xl p-6 border border-siso-border">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={statVariants}
            className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-siso-border/50 hover:border-siso-border transition-colors"
          >
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-siso-text">
                {stat.value}
              </div>
              <div className="text-siso-text/60 text-sm">
                {stat.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
