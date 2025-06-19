
import { 
  LayoutDashboard, Users, MessageSquare, UserCheck,
  ListTodo, CalendarClock, CreditCard, Settings,
  ClipboardList, Building2, UserCog, FileText,
  ScrollText
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
      items: [
        {
          href: '/admin/clients',
          icon: Building2,
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
      items: [
        {
          href: '/admin/teams',
          icon: UserCog,
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
      icon: ScrollText,
      items: [
        {
          href: '/admin/daily-planner',
          icon: CalendarClock,
          label: 'Daily Planner',
        },
        {
          href: '/admin/payments',
          icon: CreditCard,
          label: 'Financials',
        },
        {
          href: '/admin/templates',
          icon: FileText,
          label: 'Templates',
        }
      ]
    },
    {
      type: 'section',
      title: 'System',
      icon: Settings,
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
