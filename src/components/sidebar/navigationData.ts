
import { 
  LayoutDashboard, ListTodo, MessageSquare, Wallet, 
  Trophy, FileText, HelpCircle, 
  ClipboardList, CalendarClock, User
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
      icon: ListTodo,
      items: [
        {
          href: '/projects/tasks',
          icon: ListTodo,
          label: 'Active Tasks',
        },
        {
          href: '/plan-builder',
          icon: MessageSquare,
          label: 'SISO Assistant',
        },
        {
          href: '/projects/timeline',
          icon: CalendarClock,
          label: 'Timeline',
        },
        {
          href: '/projects/plan-features',
          icon: ClipboardList,
          label: 'App Plan',
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
          label: 'Financial',
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
      title: 'Resources',
      icon: HelpCircle,
      items: [
        {
          href: '/resources',
          icon: HelpCircle,
          label: 'Help & Support',
        },
        {
          href: '/resources/documents',
          icon: FileText,
          label: 'Documents',
        }
      ]
    }
  ];
};
