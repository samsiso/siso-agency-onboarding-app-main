import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search, Users, Video, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationHeaderProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const EducationHeader = ({ stats, searchQuery, onSearchChange }: EducationHeaderProps) => {
  const statCards = [
    {
      icon: GraduationCap,
      label: "Total Educators",
      value: stats.totalEducators,
      gradient: "from-siso-red/20 to-siso-orange/20",
      iconColor: "text-siso-red"
    },
    {
      icon: Video,
      label: "Total Videos",
      value: stats.totalVideos,
      gradient: "from-blue-500/20 to-purple-500/20",
      iconColor: "text-blue-500"
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      gradient: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "p-6 rounded-xl border border-siso-border",
                "bg-gradient-to-br backdrop-blur-sm",
                stat.gradient,
                "hover:border-siso-border-hover transition-all duration-300",
                "group"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-lg bg-white/5",
                  "group-hover:scale-110 transition-transform duration-300"
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
                    {stat.value.toLocaleString()}
                  </motion.div>
                  <div className="text-siso-text/60 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search Section */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/50 
            group-hover:text-siso-orange transition-colors duration-300" />
          <Input
            type="text"
            placeholder="Search educators and videos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-10 bg-siso-bg-alt/50 border-siso-border",
              "backdrop-blur-sm",
              "focus:ring-2 focus:ring-siso-orange/50 focus:border-siso-orange",
              "hover:bg-siso-bg-alt hover:border-siso-border-hover",
              "transition-all duration-300"
            )}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
            rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>
    </div>
  );
};