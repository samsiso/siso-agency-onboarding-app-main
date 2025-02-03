import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
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
        'relative flex items-center gap-3 rounded-lg px-3 py-2 text-siso-text transition-all duration-300',
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
      {isActive && (
        <motion.div
          layoutId="sidebar-highlight"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-siso-red/5 to-siso-orange/5 -z-10"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-siso-red to-siso-orange rounded-r-full">
            <div className="absolute w-6 h-6 bg-siso-orange/20 rounded-full blur-md -left-2" />
          </div>
        </motion.div>
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
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return menuItem;
};