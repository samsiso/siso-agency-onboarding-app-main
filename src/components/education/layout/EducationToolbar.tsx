import { motion } from 'framer-motion';
import { Video, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EducationToolbarProps {
  activeSection: 'videos' | 'educators';
  onSectionChange: (section: 'videos' | 'educators') => void;
}

export function EducationToolbar({
  activeSection,
  onSectionChange,
}: EducationToolbarProps) {
  const sections = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'educators', label: 'Educators', icon: Users }
  ] as const;

  return (
    <div className="flex justify-center mb-6">
      <div className="flex items-center gap-2 bg-siso-bg-alt/50 p-1 rounded-lg backdrop-blur-sm border border-siso-border">
        {sections.map(({ id, label, icon: Icon }) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}