
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { SetupChecklist } from '@/components/home/SetupChecklist';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { 
  Layout, 
  Folder, 
  Users, 
  CreditCard, 
  Bot, 
  BookOpen,
  MessageSquare,
  BarChart,
  LineChart,
  Calendar
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
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Checklist and Key Stats */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <SetupChecklist />
            <DashboardStats />
            <QuickActions />
          </div>
          
          {/* Right Column - Quick Access */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <DashboardCard
              title="Calendar"
              description="Schedule meetings and view upcoming events"
              icon={Calendar}
              href="/calendar"
              delay={0}
            />
            <DashboardCard
              title="Messages"
              description="Chat with your team and clients"
              icon={MessageSquare}
              href="/messages"
              delay={1}
            />
            <DashboardCard
              title="Analytics"
              description="View your business performance"
              icon={LineChart}
              href="/analytics"
              delay={2}
            />
          </div>
          
          {/* Feature Cards */}
          <div className="col-span-12">
            <h2 className="text-xl font-semibold text-white mb-5">Agency Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <DashboardCard
                title="Plan Builder" 
                description="Create app plans and cost estimates for your clients."
                icon={Layout}
                href="/plan-builder"
                delay={3}
              />
              <DashboardCard
                title="My Projects" 
                description="Manage your ongoing projects and track progress."
                icon={Folder}
                href="/my-projects"
                delay={4}
              />
              <DashboardCard
                title="Client Portal" 
                description="View and showcase your completed projects."
                icon={Users}
                href="/portfolio"
                delay={5}
              />
              <DashboardCard
                title="Payments" 
                description="Manage payments and transactions for your projects."
                icon={CreditCard}
                href="/payments"
                delay={6}
              />
              <DashboardCard
                title="AI Assistants" 
                description="Get help from AI to streamline your workflow."
                icon={Bot}
                href="/assistants"
                delay={7}
              />
              <DashboardCard
                title="Education" 
                description="Learn best practices for app development and client management."
                icon={BookOpen}
                href="/education"
                delay={8}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
