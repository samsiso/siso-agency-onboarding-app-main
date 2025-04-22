
import { ReactNode } from "react";
import { ClientSidebar } from "../ClientSidebar";

// This matches the AdminLayout structure for consistent experience
interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#f1f0fb] to-[#e5deff]">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
