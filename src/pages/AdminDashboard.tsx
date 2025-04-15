
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { AdminStats } from '@/components/admin/dashboard/AdminStats';
import { ClientsList } from '@/components/admin/dashboard/ClientsList';
import { LeadsOverview } from '@/components/admin/dashboard/LeadsOverview';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Siso Agency Admin Dashboard</h1>
        <AdminStats />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <LeadsOverview />
          <ClientsList />
        </div>
      </div>
    </MainLayout>
  );
}
