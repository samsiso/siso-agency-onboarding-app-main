import { 
  LayoutDashboard, Briefcase, ScrollText, Wallet, 
  Trophy, FileText, HelpCircle, ClipboardList,
  ListTodo, Layout, BookOpen, User
} from 'lucide-react';

export const getMenuSections = () => {
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
      icon: Briefcase,
      items: [
        {
          href: '/projects',
          icon: ScrollText,
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
      title: 'Financial & Account',
      icon: Wallet,
      items: [
        {
          href: '/financial/payments',
          icon: Wallet,
          label: 'Payments & Billing',
        },
        {
          href: '/financial/leaderboards',
          icon: Trophy,
          label: 'Leaderboards',
        },
        {
          href: '/financial/profile',
          icon: User,
          label: 'Profile & Settings',
        }
      ]
    },
    {
      type: 'section',
      title: 'Resources & Support',
      icon: BookOpen,
      items: [
        {
          href: '/resources/documents',
          icon: FileText,
          label: 'Document Library',
        },
        {
          href: '/resources/help/getting-started',
          icon: HelpCircle,
          label: 'Getting Started',
        },
        {
          href: '/resources/help/documentation',
          icon: BookOpen,
          label: 'Documentation',
        },
        {
          href: '/resources/help/faq',
          icon: ListTodo,
          label: 'FAQ',
        },
        {
          href: '/changelog',
          icon: ClipboardList,
          label: 'Changelog',
        }
      ]
    }
  ];
};
