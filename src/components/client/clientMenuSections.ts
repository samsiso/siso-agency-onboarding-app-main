
import {
  LayoutDashboard,
  Briefcase,
  ListTodo,
  FileText,
  Wallet,
  Trophy,
  MessageSquare,
  User,
  HelpCircle,
  Library,
  PlusCircle,
} from "lucide-react";

// Sample projects for dropdown - in a real app, this would come from an API
export const clientProjects = [
  { id: 'ubahcrypt', name: 'UbahCrypt Project' },
  { id: 'nftmarket', name: 'NFT Marketplace' },
  { id: 'defiapp', name: 'DeFi Trading App' },
];

export const clientMenuSections = [
  // Project Selection is handled separately in the component
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
        href: '/client-dashboard/plan-builder',
        icon: PlusCircle,
        label: 'Create New Project',
      },
    ]
  },
  {
    type: 'section',
    title: 'Current Project',
    icon: ListTodo,
    isDynamic: true,
    items: [
      {
        href: '/client-dashboard/projects/ubahcrypt',
        icon: LayoutDashboard,
        label: 'Overview',
      },
      {
        href: '/client-dashboard/projects/ubahcrypt/plan',
        icon: FileText,
        label: 'Plan & Features',
      },
      {
        href: '/client-dashboard/projects/ubahcrypt/tasks',
        icon: ListTodo,
        label: 'Tasks',
      },
    ]
  },
  {
    type: 'section',
    title: 'Messages',
    icon: MessageSquare,
    items: []
  },
  {
    type: 'section',
    title: 'Financial',
    icon: Wallet,
    items: [
      {
        href: '/client-dashboard/financial',
        icon: Wallet,
        label: 'Payments & Billing',
      },
      {
        href: '/client-dashboard/leaderboards',
        icon: Trophy,
        label: 'Leaderboards',
      },
    ]
  },
];

// User dropdown menu items (separate from main navigation)
export const userDropdownMenuItems = [
  {
    href: '/client-dashboard/profile',
    icon: User,
    label: 'Profile & Settings',
  },
  {
    href: '/client-dashboard/help',
    icon: HelpCircle,
    label: 'Help & Support',
  },
  {
    href: '/client-dashboard/documents',
    icon: Library,
    label: 'Document Library',
  },
];
