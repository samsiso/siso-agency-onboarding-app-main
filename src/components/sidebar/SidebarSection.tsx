
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SidebarMenuItem } from './SidebarMenuItem';
import { MenuSection } from './types';

interface SidebarSectionProps {
  section: MenuSection;
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isItemActive: (href: string) => boolean;
}

export const SidebarSection = ({ 
  section, 
  collapsed, 
  onItemClick, 
  isItemActive 
}: SidebarSectionProps) => {
  // Only main types now
  return (
    <SidebarMenuItem
      href={section.href}
      icon={section.icon}
      label={section.label}
      collapsed={collapsed}
      onClick={onItemClick}
      isMain={true}
      isActive={isItemActive(section.href)}
    />
  );
};

