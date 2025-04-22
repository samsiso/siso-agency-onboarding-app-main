
import { NavLink } from "@/components/ui/nav-link";
import { Home, ClipboardList, FileText, FileSearch, HelpCircle, LogOut, Calendar, Clock, Receipt } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const clientNavLinks = [
  {
    label: "Dashboard",
    href: "/client-dashboard",
    icon: Home,
  },
  {
    label: "Project Status",
    href: "/client-dashboard/status",
    icon: FileSearch,
  },
  {
    label: "Documents",
    href: "/client-dashboard/documents",
    icon: FileText,
  },
  {
    label: "Tasks",
    href: "/client-dashboard/tasks",
    icon: ClipboardList,
  },
  {
    label: "Support",
    href: "/client-dashboard/support",
    icon: HelpCircle,
  },
];

export function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    navigate("/client-portal");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <aside className="min-h-screen w-64 bg-white border-r border-slate-200 flex flex-col py-6 shadow-lg z-20">
      <div className="px-6 pb-8 border-b border-slate-100">
        <img
          src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
          alt="Client Portal Logo"
          className="h-12 w-12 mb-2"
        />
        <div className="font-bold text-xl text-slate-800">Client Portal</div>
      </div>
      <nav className="flex-1 pt-6 px-4">
        <ul className="flex flex-col gap-2">
          {clientNavLinks.map((item) => {
            const active =
              location.pathname === item.href ||
              location.pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  active={active}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-3 w-full font-medium transition-colors",
                    active
                      ? "bg-vivid-purple text-white shadow-md"
                      : "text-slate-700 hover:bg-vivid-purple/10"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", active ? "text-white" : "text-vivid-purple")} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="px-6 py-4 border-t border-slate-100">
        <Button
          variant="outline"
          className="w-full flex gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
