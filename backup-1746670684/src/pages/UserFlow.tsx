import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
// Import the diagram component after ensuring React Flow is properly imported
// import { UserFlowDiagram } from '@/components/projects/userflow/UserFlowDiagram';
// Temporarily comment these out until we fix the React Flow implementation
// import { UserFlowToolbar } from '@/components/projects/userflow/UserFlowToolbar';
// import { NodeDetailsSidebar } from '@/components/projects/userflow/NodeDetailsSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Expand, Layers, Loader2, X } from 'lucide-react';

export default function UserFlow() {
  const { projectId } = useParams<{ projectId: string }>();
  
  // Selected node state to show details in sidebar
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // This will handle node selection from the flow diagram
  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
  };
  
  // This will handle closing the sidebar
  const handleCloseSidebar = () => {
    setSelectedNode(null);
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Card className="bg-black/20 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-2xl font-bold text-white">User Flow & Journey</CardTitle>
                <CardDescription className="text-gray-400">
                  Visualize the complete user experience and app flows
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  disabled={isLoading}
                >
                  <Expand className="w-4 h-4 mr-2" />
                  <span>Full Screen</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black/30 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                  disabled={isLoading}
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-black/20 rounded-lg border border-blue-500/20">
                <p className="text-sm text-gray-300">
                  This diagram shows the full user journey through your application. Each node represents a page or action in the flow.
                  <span className="ml-1 text-blue-400">Click on any node to see more details.</span>
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600/80">Live</Badge>
                  <Badge className="bg-amber-600/80">In Development</Badge>
                  <Badge className="bg-slate-600/80">Planned</Badge>
                </div>
                
                {/* <UserFlowToolbar /> */}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex gap-4">
          {/* Main Flow Diagram */}
          <div className={`${selectedNode ? 'w-2/3' : 'w-full'} transition-all duration-300 ease-in-out`}>
            <Card className="bg-black/20 border-gray-800 h-[calc(100vh-220px)]">
              <div className="flex items-center justify-center h-full">
              <div className="p-6 text-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Loading User Flow</h3>
                <p className="text-gray-400 text-sm">
                  The User Flow visualization is currently being fixed. Please check back soon.
                </p>
              </div>
            </div>
            </Card>
          </div>
          
          {/* Node Details Sidebar - only show when a node is selected */}
          {selectedNode && (
            <div className="w-1/3 transition-all duration-300 ease-in-out">
              <Card className="bg-black/20 border-gray-800 h-[calc(100vh-220px)]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">{selectedNode.label || 'Node Details'}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleCloseSidebar}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Details will appear here once the user flow feature is fully implemented.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
