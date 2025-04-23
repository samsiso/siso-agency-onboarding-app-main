
import { 
  LayoutDashboard, Briefcase, Folder, Wallet, 
  Trophy, FileText, HelpCircle, ClipboardList,
  ListTodo, Layout
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
      icon: Wallet,
      items: [
        {
          href: '/payments',
          icon: Wallet,
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
      title: 'Resources & Support',
      icon: FileText,
      items: [
        {
          href: '/resources/documents',
          icon: FileText,
          label: 'Document Library',
        },
        {
          href: '/resources/help',
          icon: HelpCircle,
          label: 'Help & Documentation',
        },
        {
          href: '/changelog',
          icon: ClipboardList,
          label: 'Changelog',
        }
      ]
    }
  ];

  return sections;
};
