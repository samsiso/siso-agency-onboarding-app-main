
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
  // [Analysis] Enhanced with brand colors and better spacing
  const statItems = [
    {
      icon: GraduationCap,
      label: "Educators",
      value: stats.totalEducators,
      color: "#FF5722", // SISO red
      growth: "+12% this month"
    },
    {
      icon: Video,
      label: "Videos",
      value: stats.totalVideos,
      color: "#FF7043", // Mid tone
      growth: "+28% this month"
    },
    {
      icon: Users,
      label: "Students",
      value: stats.totalStudents,
      color: "#FFA726", // SISO orange
      growth: "+35% this month"
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8" // Increased gap and padding
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="relative flex flex-col items-center justify-center p-8 rounded-xl 
                     bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm
                     border border-siso-orange/20 hover:border-siso-orange/40
                     group transition-all duration-300"
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

            <Icon className="w-8 h-8 mb-4" style={{ color: stat.color }} /> {/* Larger icon */}
            
            <div className="flex flex-col items-center gap-2"> {/* Increased gap */}
              <CountUp
                end={stat.value}
                duration={2}
                separator=","
                className="text-3xl font-bold text-siso-text-bold" // Larger text
              />
              <span className="text-base text-siso-text/90 font-medium">{stat.label}</span>
              
              {/* Growth Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-sm font-medium mt-1"
                style={{ color: stat.color }}
              >
                {stat.growth}
              </motion.div>
            </div>

            {/* Hover Details */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 
                bg-gradient-to-b from-black/80 to-black/90 rounded-xl p-6 
                flex flex-col items-center justify-center transition-opacity duration-300"
              initial={false}
            >
              <span className="text-base font-medium text-white mb-3">Quick Stats</span>
              <div className="text-sm text-white/90 space-y-2">
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
