
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Settings, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { checkIsAdmin } from '@/utils/supabaseHelpers';

export default function Home() {
  const { user } = useAuthSession();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      }
      setLoading(false);
    };
    
    checkAdmin();
  }, [user]);

  return (
    <DashboardLayout>
      <Helmet>
        <title>Dashboard | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome {user?.email ? user.email.split('@')[0] : 'back'} to your SISO Resource Hub
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Quick Access Cards */}
          <Card className="overflow-hidden border-muted-foreground/20">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-500/5">
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Projects
              </CardTitle>
              <CardDescription>
                Manage your ongoing projects
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm">
                Access and manage all your active projects, track their progress, and update their status.
              </p>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-blue-500/5 to-blue-500/10 flex justify-between">
              <Link to="/my-projects" className="text-sm flex items-center text-blue-500">
                View Projects <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-muted-foreground/20">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-amber-500/5">
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Resources
              </CardTitle>
              <CardDescription>
                Educational materials and guides
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm">
                Access helpful guides, tutorials, and resources to help you make the most of the platform.
              </p>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-amber-500/5 to-amber-500/10 flex justify-between">
              <Link to="/help" className="text-sm flex items-center text-amber-500">
                View Resources <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-muted-foreground/20">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-500/5">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm">
                Update your profile information, notification preferences, and security settings.
              </p>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-purple-500/5 to-purple-500/10 flex justify-between">
              <Link to="/settings" className="text-sm flex items-center text-purple-500">
                Manage Settings <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Admin Access Section */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-800/20 to-purple-600/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>
                  Access administrator controls and management tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  As an administrator, you have access to additional tools to manage users, 
                  view system analytics, and control platform settings.
                </p>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/admin">
                    Admin Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-purple-500/50 text-purple-500">
                  <Link to="/admin/clients">
                    Client Management
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
