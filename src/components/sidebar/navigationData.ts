
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
      type: 'main',
      href: '/projects/tasks',
      icon: ListTodo,
      label: 'Active Tasks',
    },
    {
      type: 'main',
      href: '/plan-builder',
      icon: MessageSquare,
      label: 'SISO Assistant',
    },
    {
      type: 'main',
      href: '/financial/payments',
      icon: Wallet,
      label: 'Financial',
    },
    {
      type: 'main',
      href: '/financial/leaderboards',
      icon: Trophy,
      label: 'Leaderboards',
    },
    {
      type: 'main',
      href: '/resources',
      icon: HelpCircle,
      label: 'Help & Support',
    },
    {
      type: 'main',
      href: '/projects/plan-features',
      icon: ClipboardList,
      label: 'App Plan',
    },
    {
      type: 'main',
      href: '/resources/documents',
      icon: FileText,
      label: 'Documents',
    },
    {
      type: 'main',
      href: '/projects/timeline',
      icon: CalendarClock,
      label: 'Timeline',
    }
  ];
};
