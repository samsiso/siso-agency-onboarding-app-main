import { Helmet } from 'react-helmet';
import { useAuthSession } from '@/hooks/useAuthSession';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { MainProjectCard } from '@/components/dashboard/MainProjectCard';
import { NotificationsCard } from '@/components/dashboard/NotificationsCard';
import { LeaderboardPreviewCard } from '@/components/dashboard/LeaderboardPreviewCard';
import { HelpSupportCard } from '@/components/dashboard/HelpSupportCard';
import { PlanBuilderCard } from '@/components/dashboard/PlanBuilderCard';
import { AppPlanSection } from '@/components/projects/details/AppPlanSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

export default function Home() {
  const { user } = useAuthSession();
  const { isAdmin } = useAdminCheck();
  const [isAppPlanOpen, setIsAppPlanOpen] = useState(true);
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <WelcomeHeader />
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Main Project Card */}
          <MainProjectCard />
          
          {/* Additional Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <NotificationsCard />
            </div>
            <div className="lg:col-span-1">
              <LeaderboardPreviewCard />
            </div>
            <div className="lg:col-span-1">
              <HelpSupportCard />
            </div>
          </div>
          
          {/* Plan Builder Card */}
          <PlanBuilderCard />
          
          {/* App Plan Section (from the old page, now in dashboard) */}
          <div className="mt-8">
            <Collapsible 
              open={isAppPlanOpen} 
              onOpenChange={setIsAppPlanOpen}
              className="bg-black/30 border border-white/10 rounded-xl overflow-hidden"
            >
              <CollapsibleTrigger className="w-full flex justify-between items-center p-4 hover:bg-black/40">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-purple-400" />
                  App Development Plan
                </h2>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {isAppPlanOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4">
                  <AppPlanSection />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        {/* Admin Access Card - Only shown to admin users */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-purple-800/20 to-purple-600/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  As an administrator, you have access to additional tools to manage users, 
                  view system analytics, and control platform settings.
                </p>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/admin">Admin Dashboard</Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-500/50 text-purple-500">
                  <Link to="/admin/clients">Client Management</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
