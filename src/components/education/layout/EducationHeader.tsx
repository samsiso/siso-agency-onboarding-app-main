import { GraduationCap } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface EducationHeaderProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const popularCategories = [
  "AI Tools",
  "Marketing",
  "Automation",
  "Content Creation",
  "Business Growth",
  "Agency Management"
];

export const EducationHeader = ({ stats, searchQuery, onSearchChange }: EducationHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 p-8 border border-siso-border shadow-lg backdrop-blur-sm"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-8 h-8 text-siso-orange" />
          <GradientText
            colors={["#FF5722", "#FFA726", "#FF5722"]}
            animationSpeed={6}
            className="text-4xl font-bold"
          >
            SISO EDUCATION HUB
          </GradientText>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl font-bold text-siso-orange">{stats.totalEducators}</div>
            <div className="text-siso-text/80">Educators</div>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl font-bold text-siso-orange">{stats.totalVideos}</div>
            <div className="text-siso-text/80">Total Videos</div>
          </motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
          >
            <div className="text-2xl font-bold text-siso-orange">{stats.totalStudents}</div>
            <div className="text-siso-text/80">Total Students</div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search educators, topics, or videos..."
              className="w-full pl-10 bg-white/5 border-white/10"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {popularCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="hover:bg-siso-orange/20 cursor-pointer transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};