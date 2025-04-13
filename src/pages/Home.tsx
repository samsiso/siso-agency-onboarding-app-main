
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
import { 
  Calendar,
  MessageSquare,
  LineChart,
  Layout, 
  Folder, 
  Users, 
  CreditCard, 
  Bot, 
  BookOpen
} from 'lucide-react';

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
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader />
        
        {/* Main Dashboard Content - Masonry Layout */}
        <MasonryDashboard />
      </div>
    </MainLayout>
  );
}
