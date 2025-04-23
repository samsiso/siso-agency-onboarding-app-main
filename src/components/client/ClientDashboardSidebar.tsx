
import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClientSidebarNavigation } from "./ClientSidebarNavigation";

export function ClientDashboardSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-1 py-2">
          <img
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
            alt="Client Portal Logo"
            className="h-9 w-9 rounded transition-all"
          />
          <span className="font-semibold text-lg text-[#8B5CF6] tracking-tight">Client Portal</span>
        </div>
      </SidebarHeader>
      <ClientSidebarNavigation />
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
