
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // [Analysis] Simplified navigation handler to work with all route types
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (!href) return;

    // [Analysis] Handle both anchor links and route navigation
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    } else {
      // [Analysis] Use absolute path for navigation to ensure consistent routing
      navigate(href);
    }

    // Close mobile menu after navigation
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // [Analysis] Reset mobile menu state on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  const sidebarVariants = {
    expanded: {
      width: isMobile ? "16rem" : "16rem",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }
    },
    collapsed: {
      width: isMobile ? "0" : "4rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 35,
        mass: 0.8
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isProfileOpen) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isProfileOpen) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {isMobile && (
        <motion.div
          initial={false}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 right-4 z-50 bg-siso-bg/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-siso-text" />
                ) : (
                  <Menu className="h-6 w-6 text-siso-text" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      )}

      <motion.div 
        initial={false}
        animate={
          isMobile 
            ? isMobileMenuOpen ? "expanded" : "collapsed"
            : isExpanded ? "expanded" : "collapsed"
        }
        variants={sidebarVariants}
        className={`
          fixed top-0 h-screen overflow-y-auto
          bg-gradient-to-b from-siso-bg to-siso-bg/95 
          border-r border-siso-text/10 shadow-lg
          ${isMobile ? 'left-0 z-40' : ''}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarLogo 
          collapsed={!isExpanded} 
          setCollapsed={() => setIsExpanded(!isExpanded)}
          onLogoClick={() => setShowNavigation(!showNavigation)}
        />
        <AnimatePresence mode="wait">
          <SidebarNavigation 
            collapsed={!isExpanded} 
            onItemClick={handleItemClick}
            visible={showNavigation}
          />
        </AnimatePresence>
        <SidebarFooter 
          collapsed={!isExpanded} 
          onProfileOpen={(isOpen) => {
            setIsProfileOpen(isOpen);
            if (isOpen) setIsExpanded(true);
          }}
        />
      </motion.div>

      <motion.div 
        className="min-h-screen"
        animate={{
          marginLeft: !isMobile ? (isExpanded ? '16rem' : '4rem') : 0
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
      >
        {isMobile && isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </motion.div>
    </>
  );
};

