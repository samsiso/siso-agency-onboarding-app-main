import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Settings, FileSpreadsheet, ChevronRight, Shield, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { checkIsAdmin } from '@/utils/supabaseHelpers';
import { useUser } from '@/hooks/useUser';

export default function Home() {
  const { user } = useAuthSession();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        console.log('Home page - Checking admin status for user:', user.id);
        try {
          // Check admin status directly
          const adminStatus = await checkIsAdmin();
          console.log('Home page - Admin check result:', adminStatus);
          
          // Also check roles directly from the database for debugging
          const { data: roles, error } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error fetching roles:', error);
          } else {
            console.log('User roles from database:', roles);
            setDebugInfo({
              userId: user.id,
              email: user.email,
              roles,
              adminCheckResult: adminStatus
            });
          }
          
          setIsAdmin(adminStatus);
        } catch (err) {
          console.error('Error checking admin status:', err);
          toast({
            variant: "destructive",
            title: "Admin check failed",
            description: "There was a problem checking your admin status."
          });
        }
      } else {
        console.log('Home page - No user available for admin check');
      }
      setLoading(false);
    };
    
    checkAdmin();
  }, [user, toast]);

  // Helper function to set user as admin (for debugging purposes)
  const makeUserAdmin = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Add the current user to admin role
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ user_id: user.id, role: 'admin' }]);
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already an admin",
            description: "This user already has admin privileges."
          });
        } else {
          console.error('Error making user admin:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to set admin privileges: " + error.message
          });
        }
      } else {
        toast({
          title: "Success!",
          description: "Admin privileges have been granted. Please refresh the page."
        });
        // Re-check admin status
        const adminStatus = await checkIsAdmin();
        setIsAdmin(adminStatus);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Debug Information Card */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader className="bg-slate-800/80">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Authentication Debug Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">User ID:</p>
                <p className="text-xs font-mono bg-slate-900 p-2 rounded">{user?.id || 'Not authenticated'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Email:</p>
                <p className="text-xs font-mono bg-slate-900 p-2 rounded">{user?.email || 'Not available'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Admin Status:</p>
                {loading ? (
                  <p>Checking...</p>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full flex items-center ${
                      isAdmin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      {isAdmin ? 'Admin' : 'Not Admin'}
                    </span>
                  </div>
                )}
              </div>
              
              {debugInfo?.roles && (
                <div>
                  <p className="text-sm font-medium">Roles in Database:</p>
                  <pre className="text-xs font-mono bg-slate-900 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(debugInfo.roles, null, 2)}
                  </pre>
                </div>
              )}
              
              <div>
                <Button 
                  onClick={makeUserAdmin} 
                  disabled={loading} 
                  variant="secondary"
                  className="text-sm"
                >
                  {loading ? 'Working...' : 'Grant Admin Privileges'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
        
        {/* Admin Access Section - with debugging information */}
        {loading ? (
          <div className="text-sm text-gray-500 mb-4">Checking admin status...</div>
        ) : isAdmin ? (
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
        ) : (
          <div className="text-sm text-gray-500 mb-4">Admin features not available for your account.</div>
        )}
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* HELP CENTER SECTION */}
        <section>
          <DashboardHelpCenter />
        </section>
      </div>
    </DashboardLayout>
  );
}

import { DashboardHelpCenter } from "@/components/dashboard/DashboardHelpCenter";
