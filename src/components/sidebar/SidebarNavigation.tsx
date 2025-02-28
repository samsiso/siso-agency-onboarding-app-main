
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

  // [Analysis] Enhanced debugging for route matching
  useEffect(() => {
    console.log('Current pathname:', location.pathname);
    
    // Test some key routes for debugging
    const testRoutes = ['/economy/leaderboards', '/economy/crypto-exchange', '/economy/earn'];
    testRoutes.forEach(route => {
      const isActive = isItemActive(route);
      console.log(`Route ${route} active?`, isActive);
    });
  }, [location.pathname]);

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
  const isItemActive = (href: string, isMainRoute: boolean = false) => {
    // Handle hash-based navigation
    if (href.startsWith('#')) {
      return href === activeSection;
    }

    // Remove trailing slashes for consistency
    const currentPath = location.pathname.replace(/\/$/, '');
    const targetPath = href.replace(/\/$/, '');

    // Check if the current path exactly matches the target path
    const exactMatch = currentPath === targetPath;
    
    // Check if the current path is a child of the target path
    // This is important for sections like /economy/* where we want the parent item to be active
    const isChildPath = currentPath.startsWith(targetPath + '/');
    
    // For main routes like /ai-news, match both exact and child routes
    if (isMainRoute) {
      return exactMatch || isChildPath;
    }
    
    // For economy section items, we need special handling to ensure they activate properly
    if (targetPath.startsWith('/economy/')) {
      return exactMatch;
    }
    
    // For section items (like /tools), use strict matching by default
    return exactMatch;
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
              className={cn(
                "space-y-1",
                section.type === 'section' && "border-b border-siso-border pb-2"
              )}
            >
              <SidebarSection
                section={section}
                collapsed={collapsed}
                onItemClick={onItemClick}
                isItemActive={(href) => isItemActive(href, section.type === 'main')}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
