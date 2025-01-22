import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { 
  Home, 
  GraduationCap, 
  Wrench, 
  Bot, 
  Users, 
  Newspaper,
  Wallet,
  Trophy,
  DollarSign
} from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  visible: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      onItemClick(e);
      navigate(href);
    }
  };

  if (!visible) return null;

  const menuItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
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
      href: '/siso-ai',
      icon: Bot,
      label: 'SISO AI',
    },
    {
      href: '/community',
      icon: Users,
      label: 'Community',
    },
    {
      href: '/ai-news',
      icon: Newspaper,
      label: 'AI News',
    },
    {
      section: 'Economy',
      icon: Wallet,
      items: [
        {
          href: '/how-to-earn',
          icon: Trophy,
          label: 'Earn SISO',
        },
        {
          href: '/crypto',
          icon: DollarSign,
          label: 'Crypto Exchange',
        },
      ],
    },
  ];

  return (
    <nav className="px-3 py-4">
      <div className="space-y-1">
        {menuItems.map((item, index) => {
          if ('section' in item) {
            const isExpanded = expandedSection === item.section;
            return (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => toggleSection(item.section)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-sm 
                    transition-colors rounded-md
                    hover:bg-siso-text/10
                    ${collapsed ? 'justify-center' : 'justify-between'}
                    text-siso-text
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {!collapsed && <span>{item.section}</span>}
                  </div>
                  {!collapsed && (
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        isExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
                {(isExpanded || collapsed) && (
                  <div className={`space-y-1 ${collapsed ? 'mt-1' : 'ml-4'}`}>
                    {item.items.map((subItem, subIndex) => (
                      <SidebarMenuItem
                        key={subIndex}
                        href={subItem.href}
                        icon={subItem.icon}
                        label={subItem.label}
                        collapsed={collapsed}
                        onClick={handleClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <SidebarMenuItem
              key={index}
              href={item.href}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              onClick={handleClick}
            />
          );
        })}
      </div>
    </nav>
  );
};