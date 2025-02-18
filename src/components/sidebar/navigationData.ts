
import { 
  Home,
  GraduationCap,
  Network,
  Trophy,
  BarChart,
  BookOpen,
  Bot,
  Wrench,
  Users,
  Newspaper
} from 'lucide-react';
import { MenuSection } from './types';

export const menuSections: MenuSection[] = [
  {
    type: 'main',
    href: '/home',
    icon: Home,
    label: 'Home',
  },
  {
    type: 'section',
    title: 'Resources',
    icon: BookOpen,
    items: [
      {
        href: '/education',
        icon: GraduationCap,
        label: 'Education',
      },
      {
        href: '/assistants',
        icon: Bot,
        label: 'AI Assistants',
      },
      {
        href: '/tools',
        icon: Wrench,
        label: 'Tools',
      },
      {
        href: '/networking',
        icon: Network,
        label: 'Networking',
      }
    ]
  },
  {
    type: 'section',
    title: 'Economy',
    icon: Users,
    items: [
      {
        href: '/economy/crypto-exchange',
        icon: Network,
        label: 'Crypto Exchange',
      },
      {
        href: '/economy/earn',
        icon: Trophy,
        label: 'How to Earn',
      },
      {
        href: '/economy/leaderboards',
        icon: BarChart,
        label: 'Leaderboards',
      }
    ]
  },
  {
    type: 'main',
    href: '/ai-news',
    icon: Newspaper,
    label: 'AI News',
  }
];
