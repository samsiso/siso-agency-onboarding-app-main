
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { NavigationProps } from './types';
// Import a hook here to determine if the user is a client
import { useIsClient } from '@/hooks/client/useIsClient';
import { getMenuSections } from './navigationData';

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: NavigationProps) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { isClient } = useIsClient();

  const menuSections = getMenuSections(isClient);

  // [Analysis] Only use IntersectionObserver for hash-based navigation
  useEffect(() => {
    if (location.hash) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(`#${entry.target.id}`);
            }
          });
        },
        { threshold: 0.5 }
      );

      document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
      });

      return () => observer.disconnect();
    }
  }, [location.hash]);

  if (!visible) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // [Analysis] Improved route matching with exact, nested, and parent path handling
  const isItemActive = (href: string) => {
    // Remove trailing slashes for consistency
    const currentPath = location.pathname.replace(/\/$/, '');
    const targetPath = href.replace(/\/$/, '');

    // Check if the current path exactly matches the target path
    return currentPath === targetPath || currentPath.startsWith(targetPath + '/');
  };

  return (
    <motion.nav
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className={cn("px-2 py-4", collapsed && "px-1")}
    >
      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {menuSections.map((section, index) => (
            <motion.div 
              key={index}
              className="space-y-1"
            >
              <SidebarSection
                section={section}
                collapsed={collapsed}
                onItemClick={onItemClick}
                isItemActive={isItemActive}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

