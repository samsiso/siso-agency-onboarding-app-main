
import { 
  LayoutDashboard, Briefcase, ScrollText, Wallet, 
  Trophy, FileText, HelpCircle, ListTodo, 
  Layout, BookOpen, User
} from 'lucide-react';
import { MenuSection } from './types';

export const getMenuSections = (): MenuSection[] => {
  return [
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
          icon: ScrollText,
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
      title: 'Financial',
      icon: Wallet,
      items: [
        {
          href: '/financial/payments',
          icon: Wallet,
          label: 'Payments & Billing',
        },
        {
          href: '/financial/leaderboards',
          icon: Trophy,
          label: 'Leaderboards',
        }
      ]
    },
    {
      type: 'section',
      title: 'Account & Resources',
      icon: BookOpen,
      items: [
        {
          href: '/financial/profile',
          icon: User,
          label: 'Profile & Settings',
        },
        {
          href: '/resources',
          icon: HelpCircle,
          label: 'Help & Support',
        },
        {
          href: '/resources/documents',
          icon: FileText,
          label: 'Document Library',
        }
      ]
    }
  ];
};
