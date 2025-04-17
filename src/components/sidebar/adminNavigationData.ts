
import { 
  LayoutDashboard, ClipboardList, UserCog, Users,
  CreditCard, Settings, FileSpreadsheet, BarChart, CalendarClock
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
      title: 'Management',
      icon: Users,
      label: 'Management',
      items: [
        {
          href: '/admin/clients',
          icon: Users,
          label: 'Clients',
        },
        {
          href: '/admin/plans',
          icon: ClipboardList,
          label: 'Plans',
        },
        {
          href: '/admin/templates',
          icon: UserCog,
          label: 'Templates',
        },
        {
          href: '/admin/daily-planner',
          icon: CalendarClock,
          label: 'Daily Planner',
        }
      ]
    },
    {
      type: 'section',
      title: 'Analytics',
      icon: BarChart,
      label: 'Analytics',
      items: [
        {
          href: '/admin/reports',
          icon: FileSpreadsheet,
          label: 'Reports',
        },
        {
          href: '/admin/payments',
          icon: CreditCard,
          label: 'Financials',
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
        }
      ]
    }
  ];

  return sections;
};
