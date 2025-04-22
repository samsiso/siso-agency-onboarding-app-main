import { ReactNode } from "react";
import { ClientDashboardSidebar } from "../ClientDashboardSidebar";

// This matches the AdminLayout structure for consistent experience
interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#f1f0fb] to-[#e5deff]">
      <ClientDashboardSidebar />
      <main className="flex-1 overflow-y-auto ml-[240px] md:ml-[240px] transition-all">
        {children}
      </main>
    </div>
  );
}

// Note: Used new sidebar everywhere ClientLayout is used.
