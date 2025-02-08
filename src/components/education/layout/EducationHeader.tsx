
import { HeaderTitle } from './header/HeaderTitle';
import { StatsDisplay } from './header/StatsDisplay';
import { SearchSection } from './header/SearchSection';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Book, GraduationCap, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  // [Analysis] Enhanced with floating educational icons and interactive elements
  return (
    <div className="relative">
      {/* Knowledge Flow Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(71,118,230,0.1),transparent_50%)]" />
      </div>

      <Card className="relative border-siso-border bg-black/20 backdrop-blur-sm overflow-hidden">
        {/* [Analysis] Enhanced gradient overlay with education theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4776E6]/10 via-[#8E54E9]/5 to-transparent" />
        
        {/* Main Content with Enhanced Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-6 md:p-8 space-y-8"
        >
          {/* Header Section with Floating Icons */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <HeaderTitle />
            
            {/* Interactive Floating Icons */}
            <div className="hidden md:flex items-center justify-center gap-8">
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
                <Book className="w-8 h-8 text-[#4776E6]" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#4776E6]/20"
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
                <Atom className="w-8 h-8 text-[#8E54E9]" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#8E54E9]/20"
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
                <GraduationCap className="w-8 h-8 text-[#11998e]" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#11998e]/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
              </motion.div>
            </div>
          </div>

          {/* Quick Access Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <Button
              variant="default"
              className="bg-gradient-to-r from-[#4776E6] to-[#8E54E9] hover:opacity-90 transition-opacity"
            >
              Start Learning
            </Button>
            <Button
              variant="secondary"
              className="bg-gradient-to-r from-[#FF512F] to-[#DD2476] text-white hover:opacity-90 transition-opacity"
            >
              Find Mentor
            </Button>
            <Button
              variant="outline"
              className="border-[#11998e] text-[#11998e] hover:bg-[#11998e]/10"
            >
              Quick Guide
            </Button>
          </motion.div>
          
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
