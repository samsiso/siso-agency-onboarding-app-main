import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthButton } from '../AuthButton';

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  return (
    <div className="absolute bottom-0 w-full p-4 border-t border-siso-text/10 space-y-2 bg-gradient-to-t from-siso-bg to-transparent">
      <Link
        to="/settings"
        className="flex items-center gap-3 px-4 py-3 text-siso-text hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg transition-all duration-300 group cursor-pointer transform hover:translate-x-1"
      >
        <Settings className="w-5 h-5 group-hover:text-siso-red transition-colors" />
        {!collapsed && <span className="text-sm font-medium group-hover:text-siso-text-bold transition-colors">Settings</span>}
      </Link>
      {!collapsed && <AuthButton />}
    </div>
  );
};