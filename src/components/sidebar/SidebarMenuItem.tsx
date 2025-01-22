import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SidebarMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;  // Added this prop to the interface
  active: boolean;
  collapsed: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const SidebarMenuItem = ({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
  onClick
}: SidebarMenuItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-siso-text transition-all hover:text-siso-text-bold',
        active && 'bg-siso-text/5 text-siso-text-bold'
      )}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};