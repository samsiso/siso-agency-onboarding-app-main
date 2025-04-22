
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Folder, 
  List, 
  Calendar, 
  FileText, 
  File, 
  FileText as ChangelogIcon, 
  DollarSign, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type ClientNavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: ClientNavItem[] = [
  {
    label: "Dashboard",
    href: "/client-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/client-dashboard/projects",
    icon: Folder,
  },
  {
    label: "Todo List",
    href: "/client-dashboard/tasks",
    icon: List,
  },
  {
    label: "Timeline",
    href: "/client-dashboard/timeline",
    icon: Calendar,
  },
  {
    label: "Changelog",
    href: "/client-dashboard/changelog",
    icon: ChangelogIcon,
  },
  {
    label: "Documents",
    href: "/client-dashboard/documents",
    icon: FileText,
  },
  {
    label: "Financial",
    href: "/client-dashboard/financial",
    icon: DollarSign,
  },
  {
    label: "Profile",
    href: "/client-dashboard/profile",
    icon: User,
  },
];

export function ClientDashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: collapsed ? 64 : 240 }}
      className={cn(
        "h-screen bg-gradient-to-b from-[#f1f0fb] to-[#e5deff] border-r border-slate-200 flex flex-col z-20 shadow-md transition-all fixed md:static"
      )}
    >
      {/* Logo/Header */}
      <div className="flex items-center p-4 mb-2">
        <img
          src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
          alt="Client Portal Logo"
          className={cn(
            "h-9 w-9 rounded mr-3 transition-all",
            collapsed && "mx-auto mr-0"
          )}
        />
        {!collapsed && (
          <span className="text-xl font-bold text-gray-800 tracking-tight">Client Portal</span>
        )}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "ml-auto",
            collapsed && "mx-auto"
          )}
          onClick={() => setCollapsed((c) => !c)}
        >
          <svg
            className={cn("w-5 h-5 text-gray-500 transition-transform duration-200", collapsed ? "rotate-180" : "")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={collapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"} />
          </svg>
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const active =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Button
                  variant={active ? "default" : "ghost"}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-md text-base justify-start font-medium transition-colors group sidebar-navbutton",
                    active
                      ? "bg-vivid-purple text-white shadow"
                      : "text-slate-700 hover:bg-vivid-purple/10"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-vivid-purple")} />
                  {!collapsed && (
                    <span className={cn("transition-all", collapsed && "opacity-0 w-0")}>{item.label}</span>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-4 py-4 mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/client-portal")}
        >
          Logout
        </Button>
      </div>
    </motion.aside>
  );
}
