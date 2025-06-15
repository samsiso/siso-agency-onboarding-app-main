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
  TrendingUp,
  Target
} from 'lucide-react';
import { SidebarConfig, NavigationItem } from '@/components/dashboard/UnifiedSidebar';

export const affiliateNavigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home
  },
  {
    name: 'Statistics',
    href: '/dashboard/statistics',
    icon: TrendingUp,
    badge: 'New'
  },
  {
    name: 'Leaderboard',
    href: '/dashboard/leaderboard',
    icon: Trophy
  },
  {
    name: 'Referrals',
    href: '/dashboard/referrals',
    icon: Users,
    badge: 'Coming Soon'
  },
  {
    name: 'App Plan Generator',
    href: '/dashboard/app-plan-generator',
    icon: Zap,
    badge: 'Coming Soon'
  },
  {
    name: 'Training Hub',
    href: '/dashboard/training-hub',
    icon: BookOpen
  },
  {
    name: 'Help Center',
    href: '/dashboard/help-center',
    icon: HelpCircle,
    badge: 'Coming Soon'
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
    bgColor: 'bg-black',
    borderColor: 'border-orange-500/20',
    textColor: 'text-white',
    accentColor: 'bg-orange-600'
  }
}); 