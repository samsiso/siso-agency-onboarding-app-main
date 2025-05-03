
import { Helmet } from 'react-helmet';
import { useAuthSession } from '@/hooks/useAuthSession';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { MainProjectCard } from '@/components/dashboard/MainProjectCard';
import { NotificationsCard } from '@/components/dashboard/NotificationsCard';
import { LeaderboardPreviewCard } from '@/components/dashboard/LeaderboardPreviewCard';
import { HelpSupportCard } from '@/components/dashboard/HelpSupportCard';
import { PlanBuilderCard } from '@/components/dashboard/PlanBuilderCard';
import { ProjectDirectoryCard } from '@/components/projects/ProjectDirectoryCard';
import { useProjects } from '@/hooks/useProjects';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AppPlanPage() {
  const { user } = useAuthSession();
  const { isAdmin } = useAdminCheck();
  const navigate = useNavigate();
  const { data: project, isLoading, error, refetch } = useProjects();
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="/home" 
                className="inline-flex items-center gap-1.5 text-siso-text hover:text-white"
              >
                <Home size={16} strokeWidth={2} aria-hidden="true" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Page Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient-to-r from-[#9b87f5] to-[#6E59A5] mb-2">
              Dashboard
            </h1>
            <p className="text-siso-text">
              Manage your projects and tasks efficiently
            </p>
          </div>
        </div>
        
        {/* Project Card (Red UI from Projects page) */}
        <div className="mb-8">
          <Card className="p-6 bg-black/30 border border-siso-text/10">
            {isLoading ? (
              <div className="animate-pulse space-y-8">
                <div className="h-64 bg-black/20 rounded-lg" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Failed to Load Project
                </h3>
                <p className="text-siso-text mb-4 max-w-md">
                  {error instanceof Error ? error.message : 'There was an error loading your project'}
                </p>
                <Button 
                  onClick={() => refetch()}
                  className="bg-[#9b87f5] hover:bg-[#9b87f5]/80"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <ProjectDirectoryCard
                name={project?.name}
                description={project?.description}
                created_at={project?.created_at}
                status={project?.status}
                onSelect={() => navigate(`/projects/${project?.name?.toLowerCase()}`)}
              />
            )}
          </Card>
        </div>
        
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
