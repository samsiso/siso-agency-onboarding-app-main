
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { SetupChecklist } from '@/components/home/SetupChecklist';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MasonryDashboard } from '@/components/dashboard/MasonryDashboard';
import { motion } from 'framer-motion';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

export default function Home() {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  
  useEffect(() => {
    // Check if this is the first time user has visited the dashboard
    const hasVisitedBefore = localStorage.getItem('dashboard_visited');
    if (!hasVisitedBefore && user) {
      setShowWelcomeMessage(true);
      localStorage.setItem('dashboard_visited', 'true');
    }
  }, [user]);

  useEffect(() => {
    // Display welcome toast if this is first login
    if (showWelcomeMessage && user) {
      toast({
        title: "Welcome to your Dashboard!",
        description: `Hello, ${user.email ? user.email.split('@')[0] : 'User'}! Your Agency Management Platform is ready.`,
        duration: 5000,
      });
    }
  }, [showWelcomeMessage, user, toast]);

  return (
    <MainLayout>
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <FloatingOrbs />
        </div>
        <motion.div 
          className="container mx-auto px-4 py-6 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardHeader />
          <MasonryDashboard />
        </motion.div>
      </div>
    </MainLayout>
  );
}
