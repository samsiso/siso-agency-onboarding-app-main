
import { GraduationCap, Video, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface StatsDisplayProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
}

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  const statItems = [
    {
      icon: GraduationCap,
      label: "Educators",
      value: stats.totalEducators
    },
    {
      icon: Video,
      label: "Videos",
      value: stats.totalVideos
    },
    {
      icon: Users,
      label: "Students",
      value: stats.totalStudents
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="flex items-center justify-center gap-3 p-4 rounded-xl 
                     bg-black/20 border border-siso-border backdrop-blur-sm
                     hover:bg-black/30 hover:border-siso-border-hover transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Icon className="w-5 h-5 text-siso-orange group-hover:scale-110 transition-transform duration-300" />
            <div className="flex items-baseline gap-2">
              <CountUp
                end={stat.value}
                duration={2}
                separator=","
                className="text-2xl font-bold text-siso-text-bold"
              />
              <span className="text-sm text-siso-text/80 font-medium">{stat.label}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
