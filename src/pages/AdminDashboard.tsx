
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminStats } from '@/components/admin/dashboard/AdminStats';
import { ClientsList } from '@/components/admin/dashboard/ClientsList';
import { LeadsOverview } from '@/components/admin/dashboard/LeadsOverview';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { isAdmin, isLoading } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        <Loader2 className="w-8 h-8 animate-spin text-siso-orange mb-4" />
        <p className="text-siso-text">Verifying admin access...</p>
      </div>
    );
  }

  // If not admin and not loading, return null (useEffect will handle redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your central control panel for managing the platform
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 text-sm bg-purple-500/10 text-purple-400 rounded-full flex items-center">
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
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
