import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowLeft, Expand, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProjectHeader } from '@/components/projects/details/ProjectHeader';
import { ProjectCardNavigation } from '@/components/projects/details/ProjectCardNavigation';
import { SimpleUserFlowDiagram } from '@/components/projects/userflow/SimpleUserFlowDiagram';
import { FeedbackLogSection } from '@/components/projects/details/FeedbackLogSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MinimalUserFlow() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('diagram');
  
  // Parse the tab from query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'feedback') {
      setActiveTab('feedback');
    }
  }, [location.search]);
  
  // Handle tab change and update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const searchParams = new URLSearchParams(location.search);
    if (value === 'feedback') {
      searchParams.set('tab', 'feedback');
    } else {
      searchParams.delete('tab');
    }
    navigate({ search: searchParams.toString() });
  };
  
  // Basic project data for header
  const projectData = {
    name: 'UbahCrypt Minimal Flow',
    description: 'A lightweight version of the user flow diagram with feedback tracking capabilities',
    status: 'ACTIVE',
    created_at: '2023-07-01T10:00:00Z',
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Project Header */}
        <div className="space-y-8 mb-6">
          <ProjectHeader 
            name={projectData.name} 
            description={projectData.description} 
            status={projectData.status} 
            created_at={projectData.created_at} 
          />
          <ProjectCardNavigation projectId={projectId || 'minimal-flow'} />
        </div>
      
        <Card className="bg-black/20 border-gray-800 mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white p-0 h-auto"
                  onClick={() => navigate(`/projects/${projectId || 'minimal-flow'}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back to Project</span>
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Simplified User Flow</CardTitle>
              <CardDescription className="text-gray-400">
                View user journey and provide feedback
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="bg-black/30 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                onClick={() => {
                  toast({
                    title: "Full Screen Mode",
                    description: "Expanding to full screen view...",
                  });
                }}
              >
                <Expand className="w-4 h-4 mr-2" />
                <span>Full Screen</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                onClick={() => {
                  toast({
                    title: "Exporting...",
                    description: "Preparing export of the user flow diagram.",
                  });
                }}
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                <span>Export</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange} 
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="diagram" className="data-[state=active]:bg-indigo-500/20">
                  User Flow Diagram
                </TabsTrigger>
                <TabsTrigger value="feedback" className="data-[state=active]:bg-indigo-500/20">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Feedback Log
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagram" className="mt-0">
                <div className="mb-4 p-3 bg-black/20 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-gray-300">
                    This simplified diagram shows the key user journey through your application.
                    <span className="ml-1 text-blue-400">Each node represents a key screen or action.</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600/80">Core Flow</Badge>
                    <Badge className="bg-amber-600/80">Secondary Paths</Badge>
                  </div>
                </div>
                
                {/* Render the SimpleUserFlowDiagram component */}
                <SimpleUserFlowDiagram projectId={projectId || 'minimal-flow'} />
              </TabsContent>
              
              <TabsContent value="feedback" className="mt-0">
                <FeedbackLogSection />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 