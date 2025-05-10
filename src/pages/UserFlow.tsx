import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowDownToLine, 
  ArrowLeft, 
  Expand, 
  Loader2, 
  MessageSquare, 
  LayoutGrid, 
  Network 
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProjectHeader } from '@/components/projects/details/ProjectHeader';
import { ProjectCardNavigation } from '@/components/projects/details/ProjectCardNavigation';
import { UserFlowDiagram } from '@/components/projects/userflow/UserFlowDiagram';
import { EnhancedUserFlowDiagram } from '@/components/projects/userflow/EnhancedUserFlowDiagram';
import { UserFlowCardGrid } from '@/components/projects/userflow/cards/UserFlowCardGrid';
import { FeedbackLogSection } from '@/components/projects/details/FeedbackLogSection';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserFlow() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('diagram');
  const [viewMode, setViewMode] = useState<'diagram' | 'cards'>('diagram');
  
  // Parse the tab from query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'feedback') {
      setActiveTab('feedback');
    }
    
    const viewParam = searchParams.get('view');
    if (viewParam === 'cards') {
      setViewMode('cards');
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
  
  // Handle view mode change
  const handleViewModeChange = (mode: 'diagram' | 'cards') => {
    setViewMode(mode);
    const searchParams = new URLSearchParams(location.search);
    if (mode === 'cards') {
      searchParams.set('view', 'cards');
    } else {
      searchParams.delete('view');
    }
    navigate({ search: searchParams.toString() });
  };
  
  // Basic project data for header
  const projectData = {
    name: 'UbahCrypt Project',
    description: 'A revolutionary blockchain-based cryptocurrency platform with enhanced security features and cross-chain capabilities.',
    status: 'ACTIVE',
    created_at: '2025-04-01T10:00:00Z',
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Project Header - same as in ProjectDetails */}
        <div className="space-y-8 mb-6">
          <ProjectHeader 
            name={projectData.name} 
            description={projectData.description} 
            status={projectData.status} 
            created_at={projectData.created_at} 
          />
          <ProjectCardNavigation projectId={projectId || 'ubahcrypt'} />
        </div>
      
        <Card className="bg-black/20 border-gray-800 mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-white p-0 h-auto"
                  onClick={() => navigate(`/projects/${projectId || 'ubahcrypt'}`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  <span>Back to Project</span>
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold text-white">User Flow & Journey</CardTitle>
              <CardDescription className="text-gray-400">
                Visualize the complete user experience and app flows
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {activeTab === 'diagram' && (
                <div className="bg-black/30 border border-gray-800 rounded-md flex items-center p-1 mr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${viewMode === 'diagram' ? 'bg-indigo-900/50 text-indigo-300' : 'text-gray-400'}`}
                    onClick={() => handleViewModeChange('diagram')}
                  >
                    <Network className="w-4 h-4 mr-2" />
                    <span>Diagram</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 ${viewMode === 'cards' ? 'bg-indigo-900/50 text-indigo-300' : 'text-gray-400'}`}
                    onClick={() => handleViewModeChange('cards')}
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    <span>Cards</span>
                  </Button>
                </div>
              )}
            
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
                {viewMode === 'diagram' ? (
                  <>
                    <div className="mb-4 p-3 bg-black/20 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-gray-300">
                        This diagram shows the full user journey through your application. Each node represents a page or action in the flow.
                        <span className="ml-1 text-blue-400">Click on any node to see more details or right-click for more actions.</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600/80">Live</Badge>
                        <Badge className="bg-amber-600/80">In Development</Badge>
                        <Badge className="bg-slate-600/80">Planned</Badge>
                      </div>
                    </div>
                    
                    {/* Use the enhanced user flow diagram component */}
                    <EnhancedUserFlowDiagram projectId={projectId || 'ubahcrypt'} />
                  </>
                ) : (
                  <UserFlowCardGrid projectId={projectId || 'ubahcrypt'} />
                )}
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
