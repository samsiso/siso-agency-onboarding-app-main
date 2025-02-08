
import { ProfileSection } from './ProfileSection';

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  return (
    <div className="absolute bottom-0 w-full p-4 border-t border-siso-text/10 space-y-3 bg-gradient-to-t from-siso-bg to-transparent">
      <ProfileSection collapsed={collapsed} />
    </div>
  );
};
