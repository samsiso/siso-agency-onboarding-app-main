
import { HeaderTitle } from './header/HeaderTitle';
import { StatsDisplay } from './header/StatsDisplay';
import { SearchSection } from './header/SearchSection';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Book, Atom, GraduationCap } from 'lucide-react';

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
      {/* Knowledge Flow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,87,34,0.1),transparent_50%)]" />
      </div>

      <Card className="relative border-siso-border bg-black/20 backdrop-blur-sm overflow-hidden">
        {/* Brand Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-siso-red/5 via-siso-orange/5 to-transparent" />
        
        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-8 md:p-10 space-y-10"
        >
          {/* Header Section with Floating Icons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <HeaderTitle />
            
            {/* Interactive Floating Icons */}
            <div className="hidden md:flex items-center justify-center gap-10">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <Book className="w-10 h-10 text-siso-red" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-siso-red/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [-10, 0, -10],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="relative"
              >
                <Atom className="w-10 h-10 text-[#FF7043]" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#FF7043]/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotateZ: [-10, 10, -10]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <GraduationCap className="w-10 h-10 text-siso-orange" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-siso-orange/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
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
