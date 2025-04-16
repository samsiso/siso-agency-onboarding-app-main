
import { 
  Home, Layout, Briefcase, Folder, CreditCard, 
  Trophy, Users, HelpCircle, Settings,
  LayoutDashboard, ClipboardList, UserCog
} from 'lucide-react';
import { MenuSection } from './types';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export const getMenuSections = (): MenuSection[] => {
  const { isAdmin } = useAdminCheck();

  const sections: MenuSection[] = [
    {
      type: 'main',
      href: '/home',
      icon: Home,
      label: 'Dashboard',
    },
    {
      type: 'section',
      title: 'Projects',
      icon: Briefcase,
      items: [
        {
          href: '/plan-builder',
          icon: Layout,
          label: 'Plan Builder',
        },
        {
          href: '/my-projects',
          icon: Folder,
          label: 'My Projects',
        },
        {
          href: '/portfolio',
          icon: Users,
          label: 'Portfolio',
        }
      ]
    },
    {
      type: 'section',
      title: 'Financial',
      icon: CreditCard,
      items: [
        {
          href: '/payments',
          icon: CreditCard,
          label: 'Payments',
        },
        {
          href: '/economy/earn',
          icon: Trophy,
          label: 'How to Earn',
        },
        {
          href: '/economy/leaderboards',
          icon: Trophy,
          label: 'Leaderboards',
        }
      ]
    },
    {
      type: 'section',
      title: 'Support & Settings',
      icon: Settings,
      items: [
        {
          href: '/help',
          icon: HelpCircle,
          label: 'Help & Support',
        },
        {
          href: '/profile',
          icon: Settings,
          label: 'Profile',
        }
      ]
    }
  ];

  // Only add admin section if user is admin
  if (isAdmin) {
    sections.splice(2, 0, {
      type: 'section',
      title: 'Admin',
      icon: LayoutDashboard,
      items: [
        {
          href: '/admin',
          icon: LayoutDashboard,
          label: 'Dashboard',
        },
        {
          href: '/admin/plans',
          icon: ClipboardList,
          label: 'Plans',
        },
        {
          href: '/admin/templates',
          icon: UserCog,
          label: 'Templates',
        }
      ]
    });
  }

  return sections;
};
