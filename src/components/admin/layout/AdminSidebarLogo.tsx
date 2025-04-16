
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AdminSidebarLogoProps {
  collapsed: boolean;
  setCollapsed: () => void;
  onLogoClick: () => void;
}

export const AdminSidebarLogo = ({ 
  collapsed, 
  setCollapsed, 
  onLogoClick 
}: AdminSidebarLogoProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center cursor-pointer"
        onClick={onLogoClick}
      >
        <div className="relative">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
        </div>

        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="ml-3"
          >
            <h1 className="text-white font-bold text-xl tracking-tight">Admin</h1>
          </motion.div>
        )}
      </motion.div>

      <button
        onClick={setCollapsed}
        className={cn(
          "w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center",
          "hover:bg-gray-700 transition-colors",
          collapsed && "opacity-0 pointer-events-none"
        )}
      >
        <svg
          className="w-3 h-3 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={collapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"}
          />
        </svg>
      </button>
    </div>
  );
};
