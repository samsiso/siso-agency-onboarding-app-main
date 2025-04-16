
import { 
  LayoutDashboard, 
  ClipboardList, 
  UserCog,
  Trophy,
  Users,
  Settings,
  User,
  Home, Layout, Briefcase, Folder
} from 'lucide-react';
import { MenuSection } from './types';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export const getMenuSections = (): MenuSection[] => {
  const { isAdmin } = useAdminCheck();

  if (isAdmin) {
    return [
      {
        type: 'main',
        href: '/admin',
        icon: LayoutDashboard,
        label: 'Dashboard',
      },
      {
        type: 'section',
        title: 'Management',
        icon: ClipboardList,
        items: [
          {
            href: '/admin/plans',
            icon: ClipboardList,
            label: 'Plans',
          },
          {
            href: '/admin/templates',
            icon: UserCog,
            label: 'Templates',
          }
        ]
      },
      {
        type: 'section',
        title: 'Analytics',
        icon: Trophy,
        items: [
          {
            href: '/economy/leaderboards',
            icon: Trophy,
            label: 'Leaderboards',
          },
          {
            href: '/portfolio',
            icon: Users,
            label: 'Portfolio',
          }
        ]
      },
      {
        type: 'section',
        title: 'Settings',
        icon: Settings,
        items: [
          {
            href: '/profile',
            icon: User,
            label: 'Profile',
          },
          {
            href: '/settings',
            icon: Settings,
            label: 'Settings',
          }
        ]
      }
    ];
  }

  // Return regular user navigation
  return [
    {
      type: 'main',
      href: '/home',
      icon: Home,
      label: 'Dashboard',
    },
    {
      type: 'section',
      title: 'Projects',
      icon: Briefcase,
      items: [
        {
          href: '/plan-builder',
          icon: Layout,
          label: 'Plan Builder',
        },
        {
          href: '/my-projects',
          icon: Folder,
          label: 'My Projects',
        },
        {
          href: '/portfolio',
          icon: Users,
          label: 'Portfolio',
        }
      ]
    },
    {
      type: 'section',
      title: 'Performance',
      icon: Trophy,
      items: [
        {
          href: '/economy/leaderboards',
          icon: Trophy,
          label: 'Leaderboards',
        }
      ]
    },
    {
      type: 'section',
      title: 'Settings',
      icon: Settings,
      items: [
        {
          href: '/profile',
          icon: User,
          label: 'Profile',
        },
        {
          href: '/settings',
          icon: Settings,
          label: 'Settings',
        }
      ]
    }
  ];
};
