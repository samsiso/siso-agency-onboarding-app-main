import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { 
  Home, 
  GraduationCap, 
  Wrench, 
  Users,
  Bot,
  Trophy
} from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  visible: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      onItemClick(e);
      navigate(href);
    }
  };

  if (!visible) return null;

  const menuItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
    },
    {
      href: '/education',
      icon: GraduationCap,
      label: 'Education',
    },
    {
      href: '/tools',
      icon: Wrench,
      label: 'Tools',
    },
    {
      href: '/networking',
      icon: Users,
      label: 'Networking',
    },
    {
      href: '/assistants',
      icon: Bot,
      label: 'GPT Assistants',
    },
    {
      href: '/how-to-earn',
      icon: Trophy,
      label: 'Earn SISO',
    }
  ];

  return (
    <nav className="px-3 py-4">
      <div className="space-y-1">
        {menuItems.map((item, index) => (
          <SidebarMenuItem
            key={index}
            href={item.href}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
            onClick={handleClick}
          />
        ))}
      </div>
    </nav>
  );
};