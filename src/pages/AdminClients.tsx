
import { useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminClientsView } from '@/components/admin/clients/AdminClientsView';

export default function AdminClients() {
  const { isAdmin, isLoading } = useAdminCheck();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You must be an admin to view this page.',
      });
    }
  }, [isAdmin, isLoading, toast]);

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
    <AdminLayout>
      <AdminClientsView isAdmin={isAdmin} />
    </AdminLayout>
  );
}
