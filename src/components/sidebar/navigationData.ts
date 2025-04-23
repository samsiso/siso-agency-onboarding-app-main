
import { 
  LayoutDashboard, Layout, Briefcase, Folder, CreditCard, 
  Trophy, Users, HelpCircle, ListTodo
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
      title: 'Projects & Tasks',
      icon: Briefcase,
      items: [
        {
          href: '/projects',
          icon: Folder,
          label: 'All Projects',
        },
        {
          href: '/projects/tasks',
          icon: ListTodo,
          label: 'Active Tasks',
        },
        {
          href: '/plan-builder',
          icon: Layout,
          label: 'Plan Builder',
        }
      ]
    },
    {
      type: 'section',
      title: 'Financial Hub',
      icon: CreditCard,
      items: [
        {
          href: '/payments',
          icon: CreditCard,
          label: 'Payments & Billing',
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
      title: 'Support & Changelog',
      icon: HelpCircle,
      items: [
        {
          href: '/changelog',
          icon: CreditCard,
          label: 'Changelog',
        }
      ]
    }
  ];

  return sections;
};
