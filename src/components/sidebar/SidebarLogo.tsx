import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface SidebarLogoProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogoClick: () => void;
}

export const SidebarLogo = ({ collapsed, setCollapsed, onLogoClick }: SidebarLogoProps) => {
  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 bg-siso-bg px-4">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-2 font-semibold text-siso-text hover:text-siso-text-bold transition-colors"
      >
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-siso-orange to-siso-red text-transparent bg-clip-text">
            SISO
          </span>
        )}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="h-8 w-8"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-siso-text" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-siso-text" />
        )}
      </Button>
    </div>
  );
};