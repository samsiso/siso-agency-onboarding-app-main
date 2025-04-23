
import {
  LayoutDashboard,
  Folder,
  List,
  Clock,
  FileText,
  File,
  DollarSign,
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
    icon: Folder,
    items: [
      {
        href: '/client-dashboard/projects',
        icon: Folder,
        label: 'Projects',
      },
      {
        href: '/client-dashboard/tasks',
        icon: List,
        label: 'Todo List',
      },
      {
        href: '/client-dashboard/timeline',
        icon: Clock,
        label: 'Timeline',
      },
      {
        href: '/client-dashboard/changelog',
        icon: FileText,
        label: 'Changelog',
      },
      {
        href: '/client-dashboard/documents',
        icon: File,
        label: 'Documents',
      },
      {
        href: '/client-dashboard/financial',
        icon: DollarSign,
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
