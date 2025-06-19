import { 
  LayoutDashboard, Users, MessageSquare, UserCheck,
  ListTodo, CalendarClock, CreditCard, Settings,
  ClipboardList, Building2, UserCog, FileText,
  ScrollText, Zap, Bot, Database, Handshake,
  Trophy, BarChart3, Activity, BookOpen, 
  Workflow, Layers, FolderOpen
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
      title: 'Partnership Program',
      icon: Handshake,
      items: [
        {
          href: '/admin/partnership',
          icon: LayoutDashboard,
          label: 'Overview',
        },
        {
          href: '/admin/partnership/leaderboard',
          icon: Trophy,
          label: 'Leaderboard',
        },
        {
          href: '/admin/partnership/referrals',
          icon: Activity,
          label: 'Referrals',
        },
        {
          href: '/admin/partnership/statistics',
          icon: BarChart3,
          label: 'Statistics',
        },
        {
          href: '/admin/partnership/training',
          icon: BookOpen,
          label: 'Training Hub',
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
      title: 'Project Management',
      icon: FolderOpen,
      items: [
        {
          href: '/admin/plans/create',
          icon: FileText,
          label: 'Plans',
        },
        {
          href: '/admin/wireframes',
          icon: Layers,
          label: 'Wireframes',
        },
        {
          href: '/admin/userflow',
          icon: Workflow,
          label: 'User Flows',
        }
      ]
    },
    {
      type: 'section',
      title: 'Automation Tools',
      icon: Zap,
      items: [
        {
          href: '/admin/prompts',
          icon: Database,
          label: 'Prompt Manager',
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
