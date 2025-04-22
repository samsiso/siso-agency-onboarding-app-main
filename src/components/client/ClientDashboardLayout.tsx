import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "./ClientSidebar";
import { ClientDashboardSidebar } from "./ClientDashboardSidebar";

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 relative">
      <ClientDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto ml-[240px] md:ml-[240px] transition-all">
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

// Note: Removed SidebarProvider and original sidebar logic for the new design.
