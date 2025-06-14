import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Target, 
  GraduationCap, 
  FileText, 
  Zap, 
  BarChart3, 
  User, 
  Settings,
  CreditCard,
  Link2,
  MessageSquare,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { NavigationItem, SidebarConfig } from '@/components/dashboard/UnifiedSidebar';

export const affiliateNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Performance',
    href: '/dashboard/performance',
    icon: TrendingUp,
    children: [
      {
        name: 'Statistics',
        href: '/dashboard/statistics',
        icon: BarChart3,
      },
      {
        name: 'Leaderboard',
        href: '/dashboard/leaderboard',
        icon: Trophy,
      },
      {
        name: 'Referrals',
        href: '/dashboard/referrals',
        icon: Users,
      }
    ]
  },
  {
    name: 'Marketing Tools',
    href: '/dashboard/tools',
    icon: Zap,
    children: [
      {
        name: 'Referral Links',
        href: '/dashboard/referral-links',
        icon: Link2,
      },
      {
        name: 'Templates',
        href: '/dashboard/templates',
        icon: FileText,
      },
      {
        name: 'App Plan Generator',
        href: '/dashboard/app-plan-generator',
        icon: Zap,
      }
    ]
  },
  {
    name: 'Education',
    href: '/dashboard/education',
    icon: GraduationCap,
    children: [
      {
        name: 'Training Hub',
        href: '/dashboard/training',
        icon: GraduationCap,
      },
      {
        name: 'Resources',
        href: '/dashboard/resources',
        icon: FileText,
      },
      {
        name: 'Webinars',
        href: '/dashboard/webinars',
        icon: Calendar,
      }
    ]
  },
  {
    name: 'Support',
    href: '/dashboard/support',
    icon: MessageSquare,
    children: [
      {
        name: 'Help Center',
        href: '/dashboard/help',
        icon: MessageSquare,
      },
      {
        name: 'Contact Support',
        href: '/dashboard/contact',
        icon: MessageSquare,
      }
    ]
  }
];

export const getAffiliateSidebarConfig = (
  userName: string = 'Partner',
  userEmail: string = 'partner@example.com'
): SidebarConfig => ({
  title: 'SISO Partner Portal',
  logo: {
    icon: Target,
    text: 'Partner Portal',
    bgColor: 'bg-orange-600'
  },
  navigation: affiliateNavigationItems,
  user: {
    name: userName,
    email: userEmail,
    role: 'Affiliate Partner'
  },
  stats: {
    title: 'This Month',
    value: '£0',
    subtitle: 'Commission Earned',
    icon: Target
  },
  theme: {
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-700',
    textColor: 'text-white',
    accentColor: 'bg-orange-600'
  }
}); 