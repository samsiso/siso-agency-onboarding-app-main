import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { cn } from '@/lib/utils';
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
  BarChart,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  visible: boolean;
}

interface MenuSection {
  type: 'main' | 'section';
  title?: string;
  href?: string;
  icon?: any;
  label?: string;
  items?: {
    href: string;
    icon: any;
    label: string;
  }[];
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['learn', 'economy']);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      onItemClick(e);
      navigate(href);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const menuSections: MenuSection[] = [
    {
      type: 'main',
      href: '/',
      icon: Home,
      label: 'Home',
    },
    {
      type: 'section',
      title: 'Learn & Network',
      items: [
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
      type: 'section',
      title: 'Economy',
      items: [
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
        {menuSections.map((section, index) => (
          <div 
            key={index} 
            className={cn(
              "space-y-1",
              section.type === 'section' && "border-b border-siso-border pb-4"
            )}
          >
            {section.type === 'main' ? (
              <SidebarMenuItem
                href={section.href!}
                icon={section.icon}
                label={section.label!}
                collapsed={collapsed}
                onClick={handleClick}
                isMain={true}
                isActive={location.pathname === section.href}
              />
            ) : (
              <div className="space-y-1">
                {section.title && !collapsed && (
                  <button
                    onClick={() => toggleSection(section.title!.toLowerCase())}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-siso-text-bold hover:text-siso-text transition-colors"
                  >
                    {section.title}
                    {expandedSections.includes(section.title.toLowerCase()) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                {(!collapsed && expandedSections.includes(section.title!.toLowerCase())) && (
                  <div className="pl-3 space-y-1 animate-accordion-down">
                    {section.items?.map((item, subIndex) => (
                      <SidebarMenuItem
                        key={subIndex}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        collapsed={collapsed}
                        onClick={handleClick}
                        isActive={location.pathname === item.href}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};