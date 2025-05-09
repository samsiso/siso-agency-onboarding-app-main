
import { Helmet } from 'react-helmet';
import { useAuthSession } from '@/hooks/useAuthSession';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, ArrowRight, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';

import { NotificationsCard } from '@/components/dashboard/NotificationsCard';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { HelpSupportCard } from '@/components/dashboard/HelpSupportCard';
import { PlanBuilderCard } from '@/components/dashboard/PlanBuilderCard';
import { ProjectHeader } from '@/components/projects/details/ProjectHeader';
import { ProjectMetricsDashboard } from '@/components/projects/details/ProjectMetricsDashboard';
import { ProjectProgressCards } from '@/components/dashboard/ProjectProgressCards';
import { useProjects } from '@/hooks/useProjects';


export default function Home() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthSession();
  const { data: projects, isLoading, error } = useProjects();
  
  // Create dummy data for the leaderboard
  const leaderboardData = [
    { id: '1', name: 'User 1', points: 335, siso_tokens: 23 },
    { id: '2', name: 'User 2', points: 774, siso_tokens: 34 },
    { id: '3', name: 'User 3', points: 898, siso_tokens: 45 },
    { id: '4', name: 'User 4', points: 500, siso_tokens: 19 },
    { id: '5', name: 'User 5', points: 330, siso_tokens: 28 }
  ];

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
          ) : projects ? (
            <>
              <ProjectHeader
                name={projects.name}
                description={projects.description || ''}
                status={projects.status}
                created_at={projects.created_at}
              />
              <div className="mt-6">
                <ProjectMetricsDashboard projectId={projects.id} />
              </div>
              
              {/* Project Progress Cards - Added here */}
              <ProjectProgressCards />
            </>
          ) : null}
        </div>
        
        {/* Main Content */}
        <div className="space-y-6 mt-6">
          
          {/* Additional Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Leaderboard takes up 2/3 of the width */}
            <div className="lg:col-span-8">
              <Card className="border-siso-border bg-black/30 hover:border-purple-500/30 transition-all duration-300 h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    {leaderboardData.map((user, index) => (
                      <motion.div 
                        key={user.id}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400/10 via-gray-400/5 to-transparent' :
                          index === 2 ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent' :
                          'bg-black/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                            index === 1 ? 'bg-gray-400/20 text-gray-400' :
                            index === 2 ? 'bg-amber-600/20 text-amber-600' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center text-white font-bold">
                            {user.name?.[0] || '?'}
                          </div>
                          <div>
                            <span className="text-white font-medium">
                              {user.name || 'User ' + (index + 1)}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-siso-text">
                              <span>{user.points} points</span>
                              {Math.random() > 0.5 ? (
                                <TrendingUp className="h-3 w-3 text-green-400" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-400" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-purple-400">{user.points}</span>
                          <div className="text-xs text-siso-text mt-1">
                            {user.siso_tokens} SISO
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4 bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    onClick={() => navigate('/economy/leaderboards')}
                  >
                    View Full Leaderboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Notifications and Help & Support stacked on remaining 1/3 */}
            <div className="lg:col-span-4 flex flex-col space-y-6">
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
