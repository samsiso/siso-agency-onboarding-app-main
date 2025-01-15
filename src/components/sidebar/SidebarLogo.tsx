import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarLogoProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const SidebarLogo = ({ collapsed, setCollapsed }: SidebarLogoProps) => {
  const handleLogoClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="p-4 border-b border-siso-text/10 bg-gradient-to-r from-siso-bg to-siso-bg/95">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <img 
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
            alt="Siso Logo" 
            className="w-8 h-8 animate-pulse"
          />
          {!collapsed && (
            <span className="text-xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">SISO</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="text-siso-text" />
          ) : (
            <ChevronDown className="text-siso-text" />
          )}
        </button>
      </div>
    </div>
  );
};