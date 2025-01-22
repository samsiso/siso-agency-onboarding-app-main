import { useNavigate } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { 
  Home,
  GraduationCap,
  Network,
  Bot,
  Coins,
  Zap,
  Newspaper,
  Brain,
  Users,
  Wrench,
  Trophy,
  Wallet,
  BarChart
} from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  visible: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      onItemClick(e);
      navigate(href);
    }
  };

  const menuItems = [
    {
      type: 'main',
      href: '/',
      icon: Home,
      label: 'Home',
    },
    {
      type: 'header',
      label: 'Learn & Network',
      items: [
        {
          href: '/learn-network',
          icon: Network,
          label: 'Overview',
        },
        {
          href: '/education',
          icon: GraduationCap,
          label: 'Education',
        },
        {
          href: '/tools',
          icon: Wrench,
          label: 'Tools',
        },
        {
          href: '/networking',
          icon: Users,
          label: 'Networking',
        },
        {
          href: '/assistants',
          icon: Bot,
          label: 'GPT Assistants',
        },
      ]
    },
    {
      type: 'header',
      label: 'Economy',
      items: [
        {
          href: '/economy',
          icon: Coins,
          label: 'Overview',
        },
        {
          href: '/economy/earn',
          icon: Trophy,
          label: 'How to Earn',
        },
        {
          href: '/economy/crypto-exchange',
          icon: Wallet,
          label: 'Crypto Exchange',
        },
        {
          href: '/economy/leaderboards',
          icon: BarChart,
          label: 'Leaderboards',
        },
      ]
    },
    {
      type: 'main',
      href: '/automations',
      icon: Zap,
      label: 'SISO Automations',
    },
    {
      type: 'main',
      href: '/ai-news',
      icon: Newspaper,
      label: 'SISO News',
    },
    {
      type: 'main',
      href: '/siso-ai',
      icon: Brain,
      label: 'SISO AI',
    },
  ];

  if (!visible) return null;

  return (
    <nav className="px-3 py-4">
      <div className="space-y-4">
        {menuItems.map((item, index) => (
          <div key={index} className="space-y-1">
            {item.type === 'main' ? (
              <SidebarMenuItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                onClick={handleClick}
                isMain={true}
              />
            ) : (
              <>
                <div className="px-3 py-2">
                  <h2 className="text-sm font-semibold text-siso-text-muted">
                    {item.label}
                  </h2>
                </div>
                {item.items?.map((subItem, subIndex) => (
                  <SidebarMenuItem
                    key={subIndex}
                    href={subItem.href}
                    icon={subItem.icon}
                    label={subItem.label}
                    collapsed={collapsed}
                    onClick={handleClick}
                  />
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};