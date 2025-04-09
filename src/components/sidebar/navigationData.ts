
import { 
  Home,
  Layout,
  Briefcase,
  Folder,
  CreditCard,
  Trophy,
  Users,
  BookOpen,
  Bot,
  Wrench,
  HelpCircle,
  Settings
} from 'lucide-react';
import { MenuSection } from './types';

export const menuSections: MenuSection[] = [
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
    title: 'Financial',
    icon: CreditCard,
    items: [
      {
        href: '/payments',
        icon: CreditCard,
        label: 'Payments',
      },
      {
        href: '/economy/earn',
        icon: Trophy,
        label: 'How to Earn',
      },
      {
        href: '/economy/leaderboards',
        icon: Trophy,
        label: 'Leaderboards',
      }
    ]
  },
  {
    type: 'section',
    title: 'Tools & Support',
    icon: Wrench,
    items: [
      {
        href: '/assistants',
        icon: Bot,
        label: 'AI Assistants',
      },
      {
        href: '/education',
        icon: BookOpen,
        label: 'Education',
      },
      {
        href: '/help',
        icon: HelpCircle,
        label: 'Help & Support',
      },
      {
        href: '/settings',
        icon: Settings,
        label: 'Settings',
      }
    ]
  }
];
