import { LucideIcon } from 'lucide-react';

interface SidebarMenuItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
  collapsed: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const SidebarMenuItem = ({ title, href, icon: Icon, collapsed, onClick }: SidebarMenuItemProps) => {
  return (
    <a
      href={href}
      onClick={(e) => onClick(e, href)}
      className="flex items-center gap-3 px-4 py-3 text-siso-text hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg transition-all duration-300 group cursor-pointer transform hover:translate-x-1"
    >
      <Icon className="w-5 h-5 text-siso-text group-hover:text-siso-red transition-colors" />
      {!collapsed && (
        <span className="text-sm font-medium group-hover:text-siso-text-bold transition-colors">{title}</span>
      )}
    </a>
  );
};