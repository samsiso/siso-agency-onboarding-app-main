
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { WelcomeBanner } from '@/components/admin/dashboard/WelcomeBanner';
import { StatsOverview } from '@/components/admin/dashboard/StatsOverview';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { ClientsList } from '@/components/admin/dashboard/ClientsList';
import { AdminTasks } from '@/components/admin/dashboard/AdminTasks';
import { AdminStats } from '@/components/admin/dashboard/AdminStats';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminCheck();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges to access this page.",
      });
      navigate('/home');
    }
  }, [isAdmin, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-200">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <WelcomeBanner user={user} />
        
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminTasks />
            <ClientsList />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <AdminStats />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
