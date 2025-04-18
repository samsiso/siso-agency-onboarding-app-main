
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminStats } from '@/components/admin/dashboard/AdminStats';
import { ClientsList } from '@/components/admin/dashboard/ClientsList';
import { LeadsOverview } from '@/components/admin/dashboard/LeadsOverview';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import { DashboardKPI } from '@/components/admin/dashboard/DashboardKPI';
import { AdminTasks } from '@/components/admin/dashboard/AdminTasks';
import { WelcomeBanner } from '@/components/admin/dashboard/WelcomeBanner';

export default function AdminDashboard() {
  const { isAdmin, isLoading, refreshAdminStatus } = useAdminCheck();
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug log the current state
  useEffect(() => {
    console.log('AdminDashboard - Admin check state:', { 
      isAdmin, 
      isLoading, 
      userId: user?.id 
    });
  }, [isAdmin, isLoading, user]);

  // Force refresh admin status when component mounts
  useEffect(() => {
    refreshAdminStatus();
  }, [refreshAdminStatus]);

  useEffect(() => {
    // Only redirect if we're not loading and the admin check has completed
    if (!isLoading && !isAdmin) {
      console.log('Not an admin, redirecting to home');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have admin privileges to access this page.",
      });
      navigate('/home');
    } else if (!isLoading && isAdmin) {
      console.log('Admin check passed, showing admin dashboard');
    }
  }, [isAdmin, isLoading, navigate, toast]);

  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-4" />
        <p className="text-gray-200">Verifying admin access...</p>
      </div>
    );
  }

  // If not admin and not loading, return null (useEffect will handle redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <WelcomeBanner user={user} />
        
        <DashboardKPI />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AdminTasks />
            <LeadsOverview />
          </div>
          <div className="space-y-6">
            <ClientsList />
            <AdminStats />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
