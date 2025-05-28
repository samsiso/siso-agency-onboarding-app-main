import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { User, LogOut, ChevronDown } from 'lucide-react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarFooterProps {
  collapsed: boolean;
  onProfileOpen: (isOpen: boolean) => void;
}

export const SidebarFooter = ({ collapsed, onProfileOpen }: SidebarFooterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onProfileOpen(open);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <motion.div
      className={cn(
        'border-t border-siso-border p-4 absolute bottom-0 left-0 right-0 bg-siso-bg/95',
        collapsed && 'p-2'
      )}
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.3 }}
    >
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left',
              collapsed ? 'justify-center' : 'justify-between',
              'hover:bg-siso-bg-alt focus:outline-none'
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-orange-500/20 text-orange-500">
                  UC
                </AvatarFallback>
              </Avatar>
              
              {!collapsed && (
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-siso-text">ubahcrypto</span>
                  <span className="text-xs text-siso-text-muted">Client</span>
                </div>
              )}
            </div>
            
            {!collapsed && (
              <ChevronDown className="h-4 w-4 text-siso-text-muted" />
            )}
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent
          align={collapsed ? "center" : "end"}
          className="w-56 bg-siso-bg-alt border-siso-border"
        >
          <DropdownMenuItem
            className="text-siso-text cursor-pointer"
            onClick={() => navigateTo('/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile & Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-siso-border" />
          
          <DropdownMenuItem className="text-siso-text cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};
