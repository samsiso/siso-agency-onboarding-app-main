import { Home, Search, Bot, Database, Users, Download } from 'lucide-react';
import { SidebarMenuItem } from './SidebarMenuItem';

const menuItems = [
  {
    title: 'Core Tools & Platforms',
    icon: Home,
    href: '/tools',
  },
  {
    title: 'Social Media Marketing',
    icon: Search,
    href: '#social',
  },
  {
    title: 'Automations & Downloads',
    icon: Download,
    href: '#automations',
  },
  {
    title: 'The AI Community',
    icon: Users,
    href: '#community',
  },
  {
    title: 'ChatGPT Assistants',
    icon: Bot,
    href: '#assistants',
  },
  {
    title: 'Additional Resources',
    icon: Database,
    href: '#resources',
  },
];

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const SidebarNavigation = ({ collapsed, onItemClick }: SidebarNavigationProps) => {
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