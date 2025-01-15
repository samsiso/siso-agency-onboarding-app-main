import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarLogo } from './sidebar/SidebarLogo';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { SidebarFooter } from './sidebar/SidebarFooter';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // Check if the href is a route (starts with /)
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }

    // Otherwise treat it as an element ID for smooth scrolling
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="sticky top-0 h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 border-r border-siso-text/10 transition-all duration-300 ease-in-out flex flex-col" style={{ width: collapsed ? '5rem' : '16rem' }}>
      <SidebarLogo collapsed={collapsed} setCollapsed={setCollapsed} />
      <SidebarNavigation collapsed={collapsed} onItemClick={handleItemClick} />
      <SidebarFooter collapsed={collapsed} />
    </div>
  );
};
