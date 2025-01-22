import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  isMain?: boolean;
}

export const SidebarMenuItem = ({
  href,
  icon: Icon,
  label,
  collapsed,
  onClick,
  className,
  isMain
}: SidebarMenuItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-siso-text transition-all hover:text-siso-text-bold hover:bg-siso-text/5',
        isMain ? 'text-lg font-semibold' : 'text-sm pl-6',
        className
      )}
    >
      <Icon className={cn("w-4 h-4", isMain && "w-5 h-5")} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};