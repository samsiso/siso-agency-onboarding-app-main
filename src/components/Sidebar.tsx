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

  return (
    <div className={`h-screen bg-siso-bg border-r border-siso-text/10 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-siso-text/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-xl font-bold text-siso-text-bold">SISO</span>
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
          <Link
            key={item.title}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 text-siso-text hover:bg-gradient-to-r from-siso-red/10 to-siso-orange/10 rounded-lg transition-colors group"
          >
            <item.icon className="w-5 h-5 text-siso-text group-hover:text-siso-red transition-colors" />
            {!collapsed && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="absolute bottom-0 w-full p-4 border-t border-siso-text/10">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 text-siso-text hover:bg-siso-text/5 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>
    </div>
  );
};