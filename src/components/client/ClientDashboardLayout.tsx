
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientDashboardSidebar } from "./ClientDashboardSidebar";

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

// Custom layout for client dashboard using the shadcn sidebar and unified styling
export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-[#f1f0fb] to-[#e5deff]">
        <ClientDashboardSidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
