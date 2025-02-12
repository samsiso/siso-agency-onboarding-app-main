
import { ProfileSection } from './ProfileSection';

interface SidebarFooterProps {
  collapsed: boolean;
  onProfileOpen: (isOpen: boolean) => void;
}

export const SidebarFooter = ({ collapsed, onProfileOpen }: SidebarFooterProps) => {
  return (
    <div 
      className="absolute bottom-0 w-full p-4 border-t border-siso-text/10 space-y-3 bg-gradient-to-t from-siso-bg to-transparent"
      onClick={(e) => e.stopPropagation()}
    >
      <ProfileSection collapsed={collapsed} onOpenChange={onProfileOpen} />
    </div>
  );
};
