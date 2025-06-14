import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  GraduationCap, 
  FileText, 
  Zap, 
  BarChart3, 
  User, 
  X,
  Target,
  Users
} from 'lucide-react';

interface PartnerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Coming Soon', href: '/dashboard/coming-soon', icon: Clock },
  { name: 'Education Hub', href: '/dashboard/education', icon: GraduationCap },
  { name: 'Templates', href: '/dashboard/templates', icon: FileText },
  { name: 'App Plan Generator', href: '/dashboard/app-plan-generator', icon: Zap },
  { name: 'Pipeline', href: '/dashboard/pipeline', icon: BarChart3 },
  { name: 'Profile Settings', href: '/dashboard/profile', icon: User },
];

export function PartnerSidebar({ isOpen, onClose }: PartnerSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-white font-semibold text-lg">Partner Portal</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-orange-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Commission Summary */}
          <div className="p-4 border-t border-gray-700">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">This Month</span>
                <Target className="h-4 w-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-white">£0</div>
              <div className="text-sm text-gray-400">Commission Earned</div>
              <div className="mt-3 flex items-center text-sm text-gray-400">
                <Users className="h-4 w-4 mr-1" />
                0 Referrals
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 