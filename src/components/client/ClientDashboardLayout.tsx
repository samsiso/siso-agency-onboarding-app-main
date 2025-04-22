
import { ReactNode } from "react";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

interface ClientDashboardLayoutProps {
  children: ReactNode;
}

// Reuse the AdminLayout for the client dashboard UI
export function ClientDashboardLayout({ children }: ClientDashboardLayoutProps) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
