
import { HeaderTitle } from './header/HeaderTitle';
import { StatsDisplay } from './header/StatsDisplay';
import { SearchSection } from './header/SearchSection';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface EducationHeaderProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const EducationHeader = ({ 
  stats, 
  searchQuery, 
  onSearchChange 
}: EducationHeaderProps) => {
  return (
    <div className="relative">
      {/* [Analysis] Hero card with consistent styling from Leaderboard page */}
      <Card className="relative border-siso-border bg-black/20 backdrop-blur-sm overflow-hidden">
        {/* [Analysis] Gradient overlay for visual depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 via-siso-orange/5 to-transparent" />
        
        {/* [Analysis] Main content with proper spacing and responsive layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-6 md:p-8 space-y-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <HeaderTitle />
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <Trophy className="w-16 h-16 text-siso-orange opacity-90" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-siso-orange/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
          
          <StatsDisplay stats={stats} />
          <SearchSection 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </motion.div>
      </Card>
    </div>
  );
};
