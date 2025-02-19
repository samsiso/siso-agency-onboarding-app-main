
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SidebarSection } from './SidebarSection';
import { NavigationProps } from './types';
import { menuSections } from './navigationData';

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: NavigationProps) => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string | null>(null);

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

  // [Analysis] Enhanced route matching logic for all navigation types
  const isItemActive = (href: string) => {
    // Handle hash-based navigation
    if (href.startsWith('#')) {
      return href === activeSection;
    }

    // Get current path segments
    const currentPathSegments = location.pathname
      .split('/')
      .filter(Boolean);

    // Get href path segments
    const hrefSegments = href
      .split('/')
      .filter(Boolean);

    // For main routes (like /ai-news), do an exact match
    if (hrefSegments.length === 1) {
      return currentPathSegments[0] === hrefSegments[0];
    }

    // For nested routes (like /economy/earn)
    // Check if current path starts with the href segments
    return hrefSegments.every((segment, index) => 
      currentPathSegments[index] === segment
    );
  };

  // [Analysis] Debug route matching
  console.log('Current pathname:', location.pathname);
  console.log('Current segments:', location.pathname.split('/').filter(Boolean));

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
              className={cn(
                "space-y-1",
                section.type === 'section' && "border-b border-siso-border pb-2"
              )}
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
