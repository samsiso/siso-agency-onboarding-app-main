import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { Menu, X, Trophy, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { AuthButton } from './AuthButton';
import { supabase } from '@/integrations/supabase/client';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userRank, setUserRank] = useState<string>('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('points, rank')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserPoints(profile.points || 0);
          setUserRank(profile.rank || 'Newbie');
        }
      }
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
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

  return (
    <>
      {/* Top Bar with Auth and Points */}
      <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-4">
        {userPoints > 0 && (
          <div className="hidden md:flex items-center gap-2 text-siso-text bg-black/20 p-2 rounded-lg">
            <Trophy className="w-4 h-4 text-siso-orange" />
            <span>{userPoints} points</span>
            <Star className="w-4 h-4 text-siso-orange ml-2" />
            <span>{userRank}</span>
          </div>
        )}
        <AuthButton />
      </div>

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