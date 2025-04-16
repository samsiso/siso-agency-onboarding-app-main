
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminStats } from '@/components/admin/dashboard/AdminStats';
import { ClientsList } from '@/components/admin/dashboard/ClientsList';
import { LeadsOverview } from '@/components/admin/dashboard/LeadsOverview';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 text-sm bg-purple-500/10 text-purple-400 rounded-full">
              Admin Access
            </span>
          </div>
        </div>
        <AdminStats />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <LeadsOverview />
          <ClientsList />
        </div>
      </div>
    </AdminLayout>
  );
}
