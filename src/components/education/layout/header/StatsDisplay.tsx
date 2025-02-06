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
      value: stats.totalEducators,
      color: "text-siso-orange"
    },
    {
      icon: Video,
      label: "Videos",
      value: stats.totalVideos,
      color: "text-blue-500"
    },
    {
      icon: Users,
      label: "Students",
      value: stats.totalStudents,
      color: "text-green-500"
    }
  ];

  return (
    <motion.div 
      className="flex justify-center gap-8 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Icon className={`w-4 h-4 ${stat.color}`} />
            <div className="flex items-baseline gap-1.5">
              <CountUp
                end={stat.value}
                duration={2}
                separator=","
                className="text-lg font-semibold text-siso-text-bold"
              />
              <span className="text-sm text-siso-text/70">{stat.label}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};