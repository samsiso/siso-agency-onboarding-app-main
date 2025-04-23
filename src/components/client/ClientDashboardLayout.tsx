
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "./ClientSidebar";

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

// Custom layout for client dashboard with the new sidebar
export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-[#f1f0fb] to-[#e5deff]">
        <ClientSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
