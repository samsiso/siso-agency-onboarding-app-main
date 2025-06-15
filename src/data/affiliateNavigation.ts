import { 
  BarChart3, 
  Trophy, 
  Users, 
  Link, 
  FileText, 
  Zap, 
  GraduationCap, 
  BookOpen, 
  Video, 
  HelpCircle, 
  MessageCircle,
  Home,
  TrendingUp
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  children?: NavigationItem[];
  badge?: string;
  isActive?: boolean;
}

export const affiliateNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    isActive: true,
    children: [
      {
        id: 'statistics',
        label: 'Statistics',
        icon: TrendingUp,
        path: '/dashboard/statistics',
        badge: 'New'
      }
    ]
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: BarChart3,
    path: '/dashboard/performance',
    children: [
      {
        id: 'leaderboard',
        label: 'Leaderboard',
        icon: Trophy,
        path: '/dashboard/leaderboard',
        isActive: true
      },
      {
        id: 'referrals',
        label: 'Referrals',
        icon: Users,
        path: '/dashboard/referrals',
        badge: 'Coming Soon',
        children: [
          {
            id: 'referral-links',
            label: 'Referral Links',
            icon: Link,
            path: '/dashboard/referral-links',
            badge: 'Coming Soon'
          }
        ]
      }
    ]
  },
  {
    id: 'marketing-tools',
    label: 'Marketing Tools',
    icon: Zap,
    path: '/dashboard/tools',
    children: [
      {
        id: 'app-plan-generator',
        label: 'App Plan Generator',
        icon: Zap,
        path: '/dashboard/app-plan-generator',
        badge: 'Coming Soon',
        children: [
          {
            id: 'templates',
            label: 'Templates',
            icon: FileText,
            path: '/dashboard/templates',
            badge: 'Coming Soon'
          }
        ]
      }
    ]
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    path: '/dashboard/education',
    children: [
      {
        id: 'training-hub',
        label: 'Training Hub',
        icon: BookOpen,
        path: '/dashboard/training-hub',
        badge: 'Coming Soon',
        children: [
          {
            id: 'resources',
            label: 'Resources',
            icon: BookOpen,
            path: '/dashboard/resources',
            badge: 'Coming Soon'
          },
          {
            id: 'webinars',
            label: 'Webinars',
            icon: Video,
            path: '/dashboard/webinars',
            badge: 'Coming Soon'
          }
        ]
      }
    ]
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
    path: '/dashboard/support',
    children: [
      {
        id: 'help-center',
        label: 'Help Center',
        icon: HelpCircle,
        path: '/dashboard/help-center',
        badge: 'Coming Soon'
      },
      {
        id: 'contact-support',
        label: 'Contact Support',
        icon: MessageCircle,
        path: '/dashboard/contact-support',
        badge: 'Coming Soon'
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