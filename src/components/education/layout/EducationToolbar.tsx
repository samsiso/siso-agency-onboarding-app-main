import { Button } from '@/components/ui/button';
import { Grid2X2, List, Video, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EducationToolbarProps {
  activeSection: 'videos' | 'educators';
  viewMode: 'grid' | 'list';
  onSectionChange: (section: 'videos' | 'educators') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const EducationToolbar = ({
  activeSection,
  viewMode,
  onSectionChange,
  onViewModeChange,
}: EducationToolbarProps) => {
  const sections = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'educators', label: 'Educators', icon: Users }
  ] as const;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Section Toggle */}
      <div className="flex items-center gap-2 bg-siso-bg-alt/50 p-1 rounded-lg backdrop-blur-sm border border-siso-border">
        {sections.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="ghost"
            onClick={() => onSectionChange(id)}
            className={cn(
              "relative px-6 py-2 gap-2 transition-all duration-300",
              activeSection === id ? "text-siso-text-bold" : "text-siso-text/70 hover:text-siso-text"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {activeSection === id && (
              <motion.div
                layoutId="activeSection"
                className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-md -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Button>
        ))}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 bg-siso-bg-alt/50 p-1 rounded-lg backdrop-blur-sm border border-siso-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "relative transition-all duration-300",
            viewMode === 'grid' ? "text-siso-text-bold" : "text-siso-text/70 hover:text-siso-text"
          )}
        >
          <Grid2X2 className="w-4 h-4" />
          {viewMode === 'grid' && (
            <motion.div
              layoutId="activeView"
              className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-md -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewModeChange('list')}
          className={cn(
            "relative transition-all duration-300",
            viewMode === 'list' ? "text-siso-text-bold" : "text-siso-text/70 hover:text-siso-text"
          )}
        >
          <List className="w-4 h-4" />
          {viewMode === 'list' && (
            <motion.div
              layoutId="activeView"
              className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-md -z-10"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Button>
      </div>
    </div>
  );
};