
import {
  LayoutDashboard,
  ListTodo,
  FileText,
  Wallet,
  Trophy,
  HelpCircle,
  ClipboardList,
  FileText as Documents,
  CalendarClock,
  MessageSquare,
} from "lucide-react";

export const clientMenuSections = [
  {
    type: 'main',
    href: '/client-dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    type: 'main',
    href: '/client-dashboard/tasks',
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
    href: '/client-dashboard/financial/payments',
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
    href: '/client-dashboard/plan-features',
    icon: ClipboardList,
    label: 'App Plan',
  },
  {
    type: 'main',
    href: '/resources/documents',
    icon: Documents,
    label: 'Documents',
  },
  {
    type: 'main',
    href: '/client-dashboard/timeline',
    icon: CalendarClock,
    label: 'Timeline',
  }
];
