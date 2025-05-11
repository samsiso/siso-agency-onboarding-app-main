import React, { useState } from 'react';
import { UserFlowNavigation } from '@/components/projects/userflow/UserFlowNavigation';
import { UserFlowDiagram } from '@/components/projects/userflow/UserFlowDiagram';
import { NodeDetailsSidebar } from '@/components/projects/userflow/NodeDetailsSidebar';
import { UserFlowToolbar } from '@/components/projects/userflow/UserFlowToolbar';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

export default function UserFlowPage() {
  const { projectId = '123' } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNodeSelect = (node: any) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  };
  
  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: "Your user flow has been saved successfully.",
    });
  };
  
  const handleUndo = () => {
    toast({
      title: "Undo",
      description: "Last change has been undone.",
    });
  };
  
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-siso-bg-alt to-siso-bg">
      <UserFlowNavigation 
        projectId={projectId}
        projectName="Agency Onboarding App"
        onSave={handleSave}
        onUndo={handleUndo}
        canUndo={true}
        status="draft"
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserFlowToolbar />
          
          <div className="flex-1 overflow-auto p-4">
            <UserFlowDiagram 
              projectId={projectId}
              onNodeSelect={handleNodeSelect}
              setIsLoading={setIsLoading}
            />
          </div>
        </div>
        
        {isSidebarOpen && (
          <NodeDetailsSidebar 
            node={selectedNode || { id: 'dummy-node', type: 'screen', data: { label: 'Home Screen' } }}
            onClose={handleCloseSidebar}
          />
        )}
      </div>
    </div>
  );
} 