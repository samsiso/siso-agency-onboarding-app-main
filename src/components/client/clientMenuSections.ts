
import {
  LayoutDashboard,
  Briefcase,
  Plus,
  FileText,
  ListTodo,
  ClipboardList,
  MessageSquare,
  Wallet,
  CreditCard,
  Trophy,
} from "lucide-react";

export const clientMenuSections = [
  {
    type: 'main',
    href: '/client-dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    type: 'section',
    title: 'Projects',
    icon: Briefcase,
    items: [
      {
        href: '/client-dashboard/projects',
        icon: Briefcase,
        label: 'All Projects',
      },
      {
        href: '/client-dashboard/projects/new',
        icon: Plus,
        label: 'Create New Project',
      },
    ]
  },
  {
    type: 'section',
    title: 'Current Project',
    icon: FileText,
    items: [
      {
        href: '/client-dashboard/overview',
        icon: FileText,
        label: 'Overview',
      },
      {
        href: '/client-dashboard/plan-features',
        icon: ClipboardList,
        label: 'App Plan & Features',
      },
      {
        href: '/client-dashboard/tasks',
        icon: ListTodo,
        label: 'Tasks',
      },
    ]
  },
  {
    type: 'section',
    title: 'Messages',
    icon: MessageSquare,
    items: [
      {
        href: '/client-dashboard/messages',
        icon: MessageSquare,
        label: 'Messages',
      }
    ]
  },
  {
    type: 'section',
    title: 'Financial',
    icon: Wallet,
    items: [
      {
        href: '/client-dashboard/financial/payments',
        icon: CreditCard,
        label: 'Payments & Billing',
      },
      {
        href: '/client-dashboard/financial/leaderboards',
        icon: Trophy,
        label: 'Leaderboards',
      },
    ]
  }
];
