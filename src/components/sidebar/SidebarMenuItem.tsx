import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SidebarMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  className?: string;
}

export const SidebarMenuItem = ({
  href,
  icon: Icon,
  label,
  collapsed,
  onClick,
  className
}: SidebarMenuItemProps) => {
  return (
    <Link
      to={href}
      onClick={(e) => onClick(e, href)}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-siso-text transition-all hover:text-siso-text-bold',
        className
      )}
    >
      <Icon className="h-5 w-5" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};