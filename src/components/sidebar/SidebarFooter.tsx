import { AuthButton } from '../AuthButton';
import { Link } from 'react-router-dom';
import { UserRound, Bot } from 'lucide-react';

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  return (
    <div className="absolute bottom-0 w-full p-4 border-t border-siso-text/10 space-y-3 bg-gradient-to-t from-siso-bg to-transparent">
      <Link 
        to="/profile"
        className="flex items-center justify-center w-full gap-2 p-2.5 rounded-lg bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
          hover:from-siso-red/20 hover:to-siso-orange/20 border border-siso-text/10 hover:border-siso-text/20 
          transition-all duration-300"
      >
        <UserRound className="w-5 h-5 text-siso-red transition-colors duration-300" />
        {!collapsed && (
          <span className="text-sm font-medium bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
            Profile
          </span>
        )}
      </Link>
      <Link
        to="/siso-ai"
        className="flex items-center justify-center w-full gap-2 p-2.5 rounded-lg 
          bg-gradient-to-r from-siso-red/10 to-siso-orange/10 hover:from-siso-red/20 hover:to-siso-orange/20 
          border border-siso-text/10 hover:border-siso-text/20 transition-all duration-300 animate-glow"
      >
        <Bot className="w-5 h-5 text-siso-orange transition-colors duration-300" />
        {!collapsed && (
          <span className="text-sm font-medium bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
            SISO AI Assistant
          </span>
        )}
      </Link>
      <div className="w-full">
        <AuthButton />
      </div>
    </div>
  );
};