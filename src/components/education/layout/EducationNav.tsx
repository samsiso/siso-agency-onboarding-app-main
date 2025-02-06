import { motion } from 'framer-motion';
import { Video, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EducationNavProps {
  activeSection: 'videos' | 'educators';
  onSectionChange: (section: 'videos' | 'educators') => void;
}

export const EducationNav = ({ activeSection, onSectionChange }: EducationNavProps) => {
  const navItems = [
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'educators', label: 'Educators', icon: Users }
  ] as const;

  return (
    <div className="flex justify-center gap-4 mt-8">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSectionChange(id)}
          className={cn(
            "relative flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300",
            "hover:bg-siso-text/10",
            activeSection === id 
              ? "text-siso-text-bold" 
              : "text-siso-text/70 hover:text-siso-text-bold"
          )}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
          {activeSection === id && (
            <motion.div
              layoutId="nav-highlight"
              className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg -z-10"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
};