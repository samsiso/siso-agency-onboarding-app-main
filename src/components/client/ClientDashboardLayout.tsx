
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "./ClientSidebar";

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <ClientSidebar />
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-2 mb-2">
            {/* Sidebar knob/trigger */}
            <SidebarTrigger />
          </div>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
