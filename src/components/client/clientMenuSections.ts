
import {
  LayoutDashboard,
  ListTodo,
  Clock,
  ClipboardList,
  ScrollText,
  Wallet,
  User,
  Briefcase,
  FileText,
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
    title: 'Your Portal',
    icon: ScrollText,
    items: [
      {
        href: '/client-dashboard/projects',
        icon: Briefcase,
        label: 'Projects',
      },
      {
        href: '/client-dashboard/tasks',
        icon: ListTodo,
        label: 'Todo List',
      },
      {
        href: '/client-dashboard/timeline',
        icon: Clock,
        label: 'Timeline',
      },
      {
        href: '/client-dashboard/changelog',
        icon: ClipboardList,
        label: 'Changelog',
      },
      {
        href: '/client-dashboard/documents',
        icon: FileText,
        label: 'Documents',
      },
      {
        href: '/client-dashboard/financial',
        icon: Wallet,
        label: 'Financial',
      },
    ]
  },
  {
    type: 'main',
    href: '/client-dashboard/profile',
    icon: User,
    label: 'Profile',
  },
];
