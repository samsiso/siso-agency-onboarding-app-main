import { Home, Database, Bot, Download, MessageSquare, GraduationCap, Network } from 'lucide-react';
import { SidebarMenuItem } from './SidebarMenuItem';

const menuItems = [
  {
    title: 'Home',
    icon: Home,
    href: '/',
  },
  {
    title: 'Core Tools & Platforms',
    icon: Database,
    href: '/tools',
  },
  {
    title: 'SISO Education Hub',
    icon: GraduationCap,
    href: '/education',
  },
  {
    title: 'SISO Networking',
    icon: Network,
    href: '/networking',
  },
  {
    title: 'SISO Automations',
    icon: Download,
    href: '/automations',
  },
  {
    title: 'ChatGPT Assistants',
    icon: Bot,
    href: '/assistants',
  },
  {
    title: 'SISO AI',
    icon: MessageSquare,
    href: '/siso-ai',
  },
];

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  visible?: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible = true }: SidebarNavigationProps) => {
  if (!visible) return null;
  
  return (
    <nav className="p-2">
      {menuItems.map((item) => (
        <SidebarMenuItem
          key={item.title}
          {...item}
          collapsed={collapsed}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
};