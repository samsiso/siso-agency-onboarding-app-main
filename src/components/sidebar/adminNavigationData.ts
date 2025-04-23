
import { 
  LayoutDashboard, Users, MessageSquare, UserCheck,
  ListTodo, CalendarClock, Wallet, Settings,
  ClipboardList
} from 'lucide-react';
import { MenuSection } from './types';

export const getAdminMenuSections = (): MenuSection[] => {
  const sections: MenuSection[] = [
    {
      type: 'main',
      href: '/admin',
      icon: LayoutDashboard,
      label: 'Admin Dashboard',
    },
    {
      type: 'section',
      title: 'Client Management',
      icon: Users,
      label: 'Client Management',
      items: [
        {
          href: '/admin/clients',
          icon: Users,
          label: 'Clients',
        },
        {
          href: '/admin/outreach',
          icon: MessageSquare,
          label: 'Outreach',
        }
      ]
    },
    {
      type: 'section',
      title: 'Team Operations',
      icon: UserCheck,
      label: 'Team Operations',
      items: [
        {
          href: '/admin/teams',
          icon: UserCheck,
          label: 'Teams',
        },
        {
          href: '/admin/tasks',
          icon: ListTodo,
          label: 'Tasks',
        }
      ]
    },
    {
      type: 'section',
      title: 'Business Tools',
      icon: ClipboardList,
      label: 'Business Tools',
      items: [
        {
          href: '/admin/daily-planner',
          icon: CalendarClock,
          label: 'Daily Planner',
        },
        {
          href: '/admin/payments',
          icon: Wallet,
          label: 'Financials',
        },
        {
          href: '/admin/templates',
          icon: UserCheck,
          label: 'Templates',
        }
      ]
    },
    {
      type: 'section',
      title: 'System',
      icon: Settings,
      label: 'System',
      items: [
        {
          href: '/admin/settings',
          icon: Settings,
          label: 'Settings',
        },
        {
          href: '/changelog',
          icon: ClipboardList,
          label: 'Changelog',
        }
      ]
    }
  ];

  return sections;
};
