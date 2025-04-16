
import { 
  LayoutDashboard, ClipboardList, UserCog, Users,
  CreditCard, Settings, FileSpreadsheet, BarChart
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
        }
      ]
    },
    {
      type: 'section',
      title: 'Analytics',
      icon: BarChart,
      items: [
        {
          href: '/admin/reports',
          icon: FileSpreadsheet,
          label: 'Reports',
        },
        {
          href: '/admin/payments',
          icon: CreditCard,
          label: 'Payments',
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
        }
      ]
    }
  ];

  return sections;
};
