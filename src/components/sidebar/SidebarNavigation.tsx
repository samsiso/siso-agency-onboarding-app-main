
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarMenuItem } from './SidebarMenuItem';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  GraduationCap,
  Network,
  Coins,
  Newspaper,
  Users,
  Wrench,
  Trophy,
  Wallet,
  BarChart,
  List,
  Folder,
  Bot
} from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  visible: boolean;
}

export const SidebarNavigation = ({ collapsed, onItemClick, visible }: SidebarNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      onItemClick(e);
      navigate(href);
    }
  };

  const menuSections = [
    {
      type: 'main',
      href: '/',
      icon: Home,
      label: 'Home',
    },
    {
      type: 'section',
      title: 'Learn & Network',
      icon: Folder,
      items: [
        {
          href: '/education',
          icon: GraduationCap,
          label: 'Education',
        },
        {
          href: '/assistants',
          icon: Bot,
          label: 'AI Assistants',
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
      ]
    },
    {
      type: 'section',
      title: 'Economy',
      icon: List,
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
      href: '/ai-news',
      icon: Newspaper,
      label: 'SISO News',
    },
  ];

  if (!visible) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className={cn("px-2 py-4", collapsed && "px-1")}
    >
      <div className="space-y-2">
        <AnimatePresence mode="wait">
          {menuSections.map((section, index) => (
            <motion.div 
              key={index}
              variants={sectionVariants}
              className={cn(
                "space-y-1",
                section.type === 'section' && "border-b border-siso-border pb-2"
              )}
            >
              {section.type === 'main' ? (
                <SidebarMenuItem
                  href={section.href}
                  icon={section.icon}
                  label={section.label}
                  collapsed={collapsed}
                  onClick={handleClick}
                  isMain={true}
                  isActive={location.pathname === section.href}
                />
              ) : (
                <div className="space-y-1">
                  {section.title && !collapsed && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-siso-text-bold"
                    >
                      <section.icon className="w-4 h-4 text-siso-text-muted" />
                      {section.title}
                    </motion.div>
                  )}
                  <motion.div 
                    className={cn(
                      "space-y-1",
                      !collapsed && "pl-3 border-l-2 border-siso-border ml-4"
                    )}
                    variants={containerVariants}
                  >
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
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
