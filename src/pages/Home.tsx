
import { MainLayout } from '@/components/assistants/layout/MainLayout';
import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layout, Folder, Users, CreditCard, Bot, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SetupChecklist } from '@/components/home/SetupChecklist';

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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-to-r from-siso-red to-siso-orange mb-2">
            Welcome to Your Dashboard
          </h1>
          
          {loading ? (
            <div className="animate-pulse bg-gray-700/50 h-10 w-1/3 rounded mb-4"></div>
          ) : (
            <p className="text-siso-text mb-4">
              Hello, {user?.email ? user.email.split('@')[0] : 'User'}! Your Agency Management Platform is ready.
            </p>
          )}
        </div>
        
        {showWelcomeMessage && (
          <div className="bg-black/40 backdrop-blur-md rounded-lg border border-siso-text/10 shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Message from our CEO</h2>
            <div className="aspect-video rounded-lg bg-black/50 mb-4 overflow-hidden flex items-center justify-center">
              <div className="text-center p-4">
                <h3 className="text-white font-semibold mb-2">CEO Welcome Video</h3>
                <p className="text-siso-text text-sm">
                  Welcome to your new Agency Management Platform! We're excited to help you build amazing apps for your clients.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowWelcomeMessage(false)}
              className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
            >
              Continue to Dashboard
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Plan Builder" 
            description="Create app plans and cost estimates for your clients."
            icon={Layout}
            href="/plan-builder"
          />
          <DashboardCard 
            title="My Projects" 
            description="Manage your ongoing projects and track progress."
            icon={Folder}
            href="/my-projects"
          />
          <DashboardCard 
            title="Portfolio" 
            description="View and showcase your completed projects."
            icon={Users}
            href="/portfolio"
          />
          <DashboardCard 
            title="Payments" 
            description="Manage payments and transactions for your projects."
            icon={CreditCard}
            href="/payments"
          />
          <DashboardCard 
            title="AI Assistants" 
            description="Get help from AI to streamline your workflow."
            icon={Bot}
            href="/assistants"
          />
          <DashboardCard 
            title="Education" 
            description="Learn best practices for app development and client management."
            icon={BookOpen}
            href="/education"
          />
        </div>
        
        {/* Replaced the QuickStart section with the SetupChecklist component */}
        <SetupChecklist />
      </div>
    </MainLayout>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
}

function DashboardCard({ title, description, icon: Icon, href }: DashboardCardProps) {
  return (
    <Card className="bg-black/30 border border-siso-text/10 rounded-lg p-6 transition-all duration-300 hover:border-siso-orange/50 hover:shadow-lg">
      <div className="flex items-start">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 mr-4">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-siso-text mb-4">{description}</p>
          <Button 
            asChild
            variant="ghost" 
            className="p-0 h-auto text-siso-orange hover:text-siso-red hover:bg-transparent"
          >
            <Link to={href} className="flex items-center">
              <span>Get Started</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
