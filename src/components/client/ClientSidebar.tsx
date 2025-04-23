
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Folder, ListTodo, Calendar, FileText, File, Wallet, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// Update nav items for the client
const sidebarItems = [
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
    icon: ListTodo,
  },
  {
    label: "Timeline",
    href: "/client-dashboard/timeline",
    icon: Calendar,
  },
  {
    label: "Changelog",
    href: "/client-dashboard/changelog",
    icon: FileText,
  },
  {
    label: "Documents",
    href: "/client-dashboard/documents",
    icon: File,
  },
  {
    label: "Financial",
    href: "/client-dashboard/financial",
    icon: Wallet,
  },
  {
    label: "Profile",
    href: "/client-dashboard/profile",
    icon: User,
  },
];

export function ClientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
            alt="Client Portal Logo"
            className="h-10 w-10 rounded"
          />
          <span className="font-semibold text-lg text-vivid-purple tracking-tight">Client Portal</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Your Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.href ||
                      location.pathname.startsWith(item.href + "/")
                    }
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.href);
                      }}
                      href={item.href}
                      className="flex items-center gap-3"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/client-portal")}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

