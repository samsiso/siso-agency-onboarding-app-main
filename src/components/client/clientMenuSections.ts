
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
  // Dashboard (Slot 1)
  {
    type: 'main',
    href: '/client-dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  // Projects Category (Slot 2)
  {
    type: 'section',
    title: 'Projects',
    icon: Briefcase,
    items: [
      // All Projects (Slot 3)
      {
        href: '/client-dashboard/projects',
        icon: Briefcase,
        label: 'All Projects',
      },
      // Create New Project (Slot 4)
      {
        href: '/client-dashboard/plan-builder',
        icon: PlusCircle,
        label: 'Create New Project',
      },
    ]
  },
  // Current Project Category - Dynamic (Slot 5)
  {
    type: 'section',
    title: 'Current Project',
    icon: ListTodo,
    isDynamic: true,
    items: [
      // Overview (Slot 6)
      {
        href: '/client-dashboard/projects/ubahcrypt',
        icon: LayoutDashboard,
        label: 'Overview',
      },
      // Plan & Features (Slot 7)
      {
        href: '/client-dashboard/projects/ubahcrypt/plan',
        icon: FileText,
        label: 'Plan & Features',
      },
      // Tasks (Slot 8)
      {
        href: '/client-dashboard/projects/ubahcrypt/tasks',
        icon: ListTodo,
        label: 'Tasks',
      },
    ]
  },
  // Messages Category (Slot 9)
  {
    type: 'section',
    title: 'Messages',
    icon: MessageSquare,
    items: []
  },
  // Financial Category (Slot 10)
  {
    type: 'section',
    title: 'Financial',
    icon: Wallet,
    items: [
      // Payments & Billing (Slot 11)
      {
        href: '/client-dashboard/financial',
        icon: Wallet,
        label: 'Payments & Billing',
      },
      // Leaderboards (Slot 12)
      {
        href: '/client-dashboard/leaderboards',
        icon: Trophy,
        label: 'Leaderboards',
      },
    ]
  },
];

// User dropdown menu items (separate from main navigation, not counted in slots)
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
