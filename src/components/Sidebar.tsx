import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Search,
  Bot,
  Database,
  Users,
  Download,
  Settings,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { AuthButton } from './AuthButton';

const menuItems = [
  {
    title: 'Core Tools & Platforms',
    icon: Home,
    href: '#tools',
  },
  {
    title: 'Social Media Marketing',
    icon: Search,
    href: '#social',
  },
  {
    title: 'Automations & Downloads',
    icon: Download,
    href: '#automations',
  },
  {
    title: 'The AI Community',
    icon: Users,
    href: '#community',
  },
  {
    title: 'ChatGPT Assistants',
    icon: Bot,
    href: '#assistants',
  },
  {
    title: 'Additional Resources',
    icon: Database,
    href: '#resources',
  },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 border-r border-siso-text/10 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-siso-text/10 bg-gradient-to-r from-siso-bg to-siso-bg/95">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                alt="Siso Logo" 
                className="w-8 h-8 animate-pulse"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">SISO</span>
            </div>
          ) : (
            <img 
              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
              alt="Siso Logo" 
              className="w-8 h-8 animate-pulse"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-siso-text/5 rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="text-siso-text" />
            ) : (
              <ChevronDown className="text-siso-text" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-2">
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            onClick={(e) => handleItemClick(e, item.href)}
            className="flex items-center gap-3 px-4 py-3 text-siso-text hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg transition-all duration-300 group cursor-pointer transform hover:translate-x-1"
          >
            <item.icon className="w-5 h-5 text-siso-text group-hover:text-siso-red transition-colors" />
            {!collapsed && (
              <span className="text-sm font-medium group-hover:text-siso-text-bold transition-colors">{item.title}</span>
            )}
          </a>
        ))}
      </nav>

      {/* Settings and Auth at bottom */}
      <div className="absolute bottom-0 w-full p-4 border-t border-siso-text/10 space-y-2 bg-gradient-to-t from-siso-bg to-transparent">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 text-siso-text hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg transition-all duration-300 group cursor-pointer transform hover:translate-x-1"
        >
          <Settings className="w-5 h-5 group-hover:text-siso-red transition-colors" />
          {!collapsed && <span className="text-sm font-medium group-hover:text-siso-text-bold transition-colors">Settings</span>}
        </Link>
        {!collapsed && <AuthButton />}
      </div>
    </div>
  );
};