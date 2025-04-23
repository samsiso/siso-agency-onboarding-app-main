
import {
  LayoutDashboard,
  ListTodo,
  Clock,
  ClipboardList,
  FileBox,
  Wallet,
  User,
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
    icon: FileBox,
    items: [
      {
        href: '/client-dashboard/projects',
        icon: FileBox,
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
        icon: FileBox,
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
