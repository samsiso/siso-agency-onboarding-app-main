import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarMenuItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  isMain?: boolean;
  isActive?: boolean;
}

export const SidebarMenuItem = ({
  href,
  icon: Icon,
  label,
  collapsed,
  onClick,
  className,
  isMain,
  isActive
}: SidebarMenuItemProps) => {
  const menuItem = (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-lg px-3 py-2 text-siso-text transition-colors',
        isActive && 'bg-siso-text/5 text-siso-text-bold',
        !isActive && 'hover:text-siso-text-bold hover:bg-siso-text/5',
        isMain ? 'text-lg font-semibold' : 'text-sm',
        collapsed ? 'justify-center' : '',
        className
      )}
    >
      <Icon 
        className={cn(
          isMain ? "w-5 h-5" : "w-4 h-4",
          isActive ? "text-siso-orange" : "text-siso-text group-hover:text-siso-orange"
        )} 
      />
      {!collapsed && (
        <span className="truncate">{label}</span>
      )}
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-siso-orange rounded-r-full" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {menuItem}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return menuItem;
};