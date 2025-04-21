
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { ClientsTable } from '@/components/admin/clients/ClientsTable';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2, Users } from 'lucide-react';
import { AdminClientsView } from '@/components/admin/clients/AdminClientsView';

export default function AdminClients() {
  const { isAdmin, isLoading } = useAdminCheck();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange mb-4" />
        <p className="text-siso-text">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminClientsView isAdmin={isAdmin} />
  );
}
