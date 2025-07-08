
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { WelcomeBanner } from '@/components/admin/dashboard/WelcomeBanner';
import { StatsOverview } from '@/components/admin/dashboard/StatsOverview';
import { QuickActions } from '@/components/admin/dashboard/QuickActions';
import { ClientsList } from '@/components/admin/dashboard/ClientsList';
import { AdminTasks } from '@/components/admin/dashboard/AdminTasks';
import { AdminStats } from '@/components/admin/dashboard/AdminStats';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Loader2, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import { motion } from 'framer-motion';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';
import AdvancedNormalizedIncidentReport from '@/components/ui/advanced-normalized-incident-report';

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-200">Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <motion.div 
        className="container mx-auto px-4 py-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdminPageTitle
          icon={Users}
          title="Admin Dashboard"
          subtitle="Welcome to your admin panel — view statistics, quick actions, and more"
        />
        <StatsOverview />
        
        {/* Incident Report Section */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AdvancedNormalizedIncidentReport />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AdminTasks />
            <ClientsList />
          </motion.div>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <QuickActions />
            <AdminStats />
          </motion.div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}

