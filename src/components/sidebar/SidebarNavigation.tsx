import { useLocation } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { 
  Home, 
  Newspaper, 
  Wrench, 
  GraduationCap, 
  Bot, 
  Network,
  UserRound,
  MessageSquare 
} from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  visible: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const location = useLocation();

  if (!visible) return null;

  const mainMenuItem = {
    href: '/',
    icon: Home,
    label: 'Home',
  };

  const subMenuItems = [
    { href: '/tools', icon: Wrench, label: 'Tools' },
    { href: '/siso-education', icon: GraduationCap, label: 'Education' },
    { href: '/networking', icon: Network, label: 'Networking' },
    { href: '/chat-gpt-assistants', icon: MessageSquare, label: 'Assistants' },
  ];

  const additionalMenuItems = [
    { href: '/ai-news', icon: Newspaper, label: 'AI News' },
    { href: '/automations', icon: Bot, label: 'Automations' },
    { href: '/siso-ai', icon: Bot, label: 'SISO AI' },
    { href: '/profile', icon: UserRound, label: 'Profile' },
  ];

  return (
    <nav className="p-4 space-y-4">
      {/* Main menu item */}
      <div className="mb-4">
        <SidebarMenuItem
          key={mainMenuItem.href}
          href={mainMenuItem.href}
          icon={mainMenuItem.icon}
          label={mainMenuItem.label}
          active={location.pathname === mainMenuItem.href}
          collapsed={collapsed}
          onClick={(e) => onItemClick(e, mainMenuItem.href)}
          className="font-medium"
        />
      </div>

      {/* Sub menu items */}
      <div className="pl-2 space-y-1 border-l border-siso-border">
        {subMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.href}
            collapsed={collapsed}
            onClick={(e) => onItemClick(e, item.href)}
            className="text-sm"
          />
        ))}
      </div>

      {/* Additional menu items */}
      <div className="space-y-1 pt-4 mt-4 border-t border-siso-border">
        {additionalMenuItems.map((item) => (
          <SidebarMenuItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.href}
            collapsed={collapsed}
            onClick={(e) => onItemClick(e, item.href)}
          />
        ))}
      </div>
    </nav>
  );
};