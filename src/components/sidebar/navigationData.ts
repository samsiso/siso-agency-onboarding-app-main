
import { 
  LayoutDashboard, Layout, Briefcase, Folder, CreditCard, 
  Trophy, Users
} from 'lucide-react';
import { MenuSection } from './types';

export const getMenuSections = (): MenuSection[] => {
  const sections: MenuSection[] = [
    {
      type: 'main',
      href: '/home',
      icon: LayoutDashboard,
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
    }
  ];

  return sections;
};
