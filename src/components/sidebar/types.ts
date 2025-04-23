
import { LucideIcon } from 'lucide-react';

export interface MenuSection {
  type: 'main';
  href: string;
  icon: LucideIcon;
  label: string;
}

export interface NavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  visible: boolean;
}

