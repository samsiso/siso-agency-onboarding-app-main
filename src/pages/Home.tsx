import { Helmet } from 'react-helmet';
import { useAuthSession } from '@/hooks/useAuthSession';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { MainProjectCard } from '@/components/dashboard/MainProjectCard';
import { NotificationsCard } from '@/components/dashboard/NotificationsCard';
import { LeaderboardPreviewCard } from '@/components/dashboard/LeaderboardPreviewCard';
import { HelpSupportCard } from '@/components/dashboard/HelpSupportCard';
import { PlanBuilderCard } from '@/components/dashboard/PlanBuilderCard';
import { ProjectHeader } from '@/components/projects/details/ProjectHeader';
import { ProjectMetricsDashboard } from '@/components/projects/details/ProjectMetricsDashboard';
import { ProjectProgressCards } from '@/components/dashboard/ProjectProgressCards';
import { useProjects } from '@/hooks/useProjects';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const { user } = useAuthSession();
  const { isAdmin } = useAdminCheck();
  const { data: project, isLoading, error } = useProjects();
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <WelcomeHeader />
        
        {/* Project Header */}
        <div className="mb-6">
          {isLoading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-64 bg-black/20 rounded-lg" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg bg-black/30 border border-white/10">
              <AlertCircle className="h-12 w-12 text-[#ea384c] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Failed to Load Project
              </h3>
              <p className="text-gray-400 mb-4 max-w-md">
                {error instanceof Error ? error.message : 'There was an error loading your project'}
              </p>
            </div>
          ) : project ? (
            <>
              <ProjectHeader
                name={project.name}
                description={project.description}
                status={project.status}
                created_at={project.created_at}
              />
              <div className="mt-6">
                <ProjectMetricsDashboard projectId={project.id} />
              </div>
              
              {/* Project Progress Cards - Added here */}
              <ProjectProgressCards />
            </>
          ) : null}
        </div>
        
        {/* Main Content */}
        <div className="space-y-6 mt-6">
          {/* Additional Cards with new layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <LeaderboardPreviewCard />
            </div>
            <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
              <NotificationsCard />
              <HelpSupportCard />
            </div>
          </div>
          
          {/* Plan Builder Card */}
          <PlanBuilderCard />
        </div>
        
        {/* Admin Access Card - Only shown to admin users */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <Card className="bg-black/30 border border-siso-text/10 hover:bg-black/40 hover:border-siso-orange/20 transition-all duration-300">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 bg-siso-orange/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-siso-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">Admin Dashboard</h3>
                  <p className="text-muted-foreground">Manage clients, templates, and organization settings</p>
                </div>
                <Button asChild>
                  <Link to="/admin/dashboard">Access Admin</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
