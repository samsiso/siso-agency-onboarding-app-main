
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
  // [Analysis] Enhanced with progress rings and hover effects
  const statItems = [
    {
      icon: GraduationCap,
      label: "Educators",
      value: stats.totalEducators,
      color: "#4776E6",
      growth: "+12% this month"
    },
    {
      icon: Video,
      label: "Videos",
      value: stats.totalVideos,
      color: "#8E54E9",
      growth: "+28% this month"
    },
    {
      icon: Users,
      label: "Students",
      value: stats.totalStudents,
      color: "#11998e",
      growth: "+35% this month"
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
            className="group relative flex flex-col items-center justify-center p-6 rounded-xl 
                     bg-black/20 border border-siso-border backdrop-blur-sm
                     hover:bg-black/30 hover:border-[#4776E6]/30 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="fill-none stroke-current"
                strokeWidth="1"
                stroke={stat.color}
                strokeOpacity="0.1"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                className="fill-none stroke-current"
                strokeWidth="1"
                stroke={stat.color}
                strokeOpacity="0.3"
                strokeDasharray="282.743"
                initial={{ strokeDashoffset: 282.743 }}
                animate={{ strokeDashoffset: 70.686 }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
            </svg>

            <Icon className={`w-6 h-6 mb-2`} style={{ color: stat.color }} />
            
            <div className="flex flex-col items-center gap-1">
              <CountUp
                end={stat.value}
                duration={2}
                separator=","
                className="text-2xl font-bold text-siso-text-bold"
              />
              <span className="text-sm text-siso-text/80 font-medium">{stat.label}</span>
              
              {/* Growth Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-xs text-green-500 font-medium mt-1"
              >
                {stat.growth}
              </motion.div>
            </div>

            {/* Hover Details */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-black/60 to-black/80 rounded-xl p-4 flex flex-col items-center justify-center transition-opacity duration-300"
              initial={false}
            >
              <span className="text-sm font-medium text-white mb-2">Quick Stats</span>
              <div className="text-xs text-white/80 space-y-1">
                <p>• Daily Active Users: 1.2k</p>
                <p>• Avg. Rating: 4.8/5</p>
                <p>• Completion Rate: 92%</p>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
