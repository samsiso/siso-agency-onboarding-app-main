import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    
    if (!href) return;

    if (href.startsWith('/')) {
      navigate(href);
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-siso-bg/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-siso-text" />
          ) : (
            <Menu className="h-6 w-6 text-siso-text" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'sticky top-0'
        } h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 border-r border-siso-text/10 shadow-lg`}
        style={{ width: collapsed && !isMobile ? '5rem' : '16rem' }}
      >
        <SidebarLogo 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          onLogoClick={() => setShowNavigation(!showNavigation)}
        />
        <SidebarNavigation 
          collapsed={collapsed} 
          onItemClick={handleItemClick}
          visible={showNavigation}
        />
        <SidebarFooter collapsed={collapsed} />
      </div>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};