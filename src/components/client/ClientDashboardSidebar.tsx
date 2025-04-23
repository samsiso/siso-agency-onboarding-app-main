
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  List,
  Clock,
  FileText,
  File,
  DollarSign,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

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
    icon: List,
  },
  {
    label: "Timeline",
    href: "/client-dashboard/timeline",
    icon: Clock,
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
    icon: DollarSign,
  },
  {
    label: "Profile",
    href: "/client-dashboard/profile",
    icon: User,
  },
];

export function ClientDashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-1 py-2">
          <img
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
            alt="Client Portal Logo"
            className="h-9 w-9 rounded transition-all"
          />
          {state === "expanded" && (
            <span className="font-semibold text-lg text-[#8B5CF6] tracking-tight">Client Portal</span>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="ml-auto"
            onClick={toggleSidebar}
          >
            {/* chevron left/right */}
            {state === "expanded" ? (
              <span className="sr-only">Collapse</span>
            ) : (
              <span className="sr-only">Expand</span>
            )}
            <svg
              className="w-5 h-5 text-vivid-purple"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                transform:
                  state === "expanded" ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  state === "expanded"
                    ? "M15 19l-7-7 7-7"
                    : "M9 5l7 7-7 7"
                }
              />
            </svg>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Your Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                    >
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(item.href);
                        }}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 w-full"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
