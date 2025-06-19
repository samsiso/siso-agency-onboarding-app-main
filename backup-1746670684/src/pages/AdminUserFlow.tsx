import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Network, Loader2, PlusCircle, Git, FlowChart } from 'lucide-react';

export default function AdminUserFlow() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Get projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, description, status, created_at');
        
      if (projectsError) throw projectsError;
      
      // For each project, check if it has user flow nodes
      const projectsWithFlowData = await Promise.all(projectsData.map(async (project) => {
        // Use type assertion to handle the new flow_nodes table
        // In production, you would regenerate types using 'supabase gen types'
        const { data: nodeData, error: countError } = await (supabase
          .from('flow_nodes') as any)
          .select('id')
          .eq('project_id', project.id)
          .limit(1);
        
        // Get total count with type assertion
        const { count } = await (supabase
          .from('flow_nodes') as any)
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id);
          
        return {
          ...project,
          hasUserFlow: !countError && count && count > 0,
          nodeCount: !countError && count ? count : 0
        };
      }));
      
      setProjects(projectsWithFlowData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      toast({
        title: "Error loading projects",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-black/20 border-gray-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white">User Flow Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and create user flow diagrams for all projects
                </CardDescription>
              </div>
              <Button 
                variant="default" 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New User Flow
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 mb-4">
              User flows help visualize the journey users will take through your application.
              Select a project below to create or edit its user flow diagram.
            </p>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              </div>
            ) : (
              <div className="bg-black/30 rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-black/40">
                      <TableHead className="text-gray-400">Project Name</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Created</TableHead>
                      <TableHead className="text-gray-400">Flow Nodes</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.length === 0 ? (
                      <TableRow className="border-gray-700">
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          No projects found
                        </TableCell>
                      </TableRow>
                    ) : (
                      projects.map(project => (
                        <TableRow key={project.id} className="border-gray-700 hover:bg-black/40">
                          <TableCell className="font-medium text-white">
                            {project.name}
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{project.description}</p>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                project.status === 'ACTIVE' ? 'bg-emerald-600' : 
                                project.status === 'PAUSED' ? 'bg-amber-600' : 
                                'bg-gray-600'
                              }
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {formatDate(project.created_at)}
                          </TableCell>
                          <TableCell>
                            {project.hasUserFlow ? (
                              <Badge className="bg-indigo-600">{project.nodeCount} Nodes</Badge>
                            ) : (
                              <Badge className="bg-gray-600">No Flow</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/admin/userflow/${project.id}`}>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-indigo-600/30 bg-indigo-950/30 text-indigo-400 hover:bg-indigo-900/30"
                              >
                                {project.hasUserFlow ? (
                                  <>
                                    <FlowChart className="h-4 w-4 mr-1.5" />
                                    Edit Flow
                                  </>
                                ) : (
                                  <>
                                    <Network className="h-4 w-4 mr-1.5" />
                                    Create Flow
                                  </>
                                )}
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
