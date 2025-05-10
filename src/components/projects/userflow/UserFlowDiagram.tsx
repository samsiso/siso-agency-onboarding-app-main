import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowProvider
} from 'reactflow';
// Import both the default ReactFlow CSS and our custom styles
import 'reactflow/dist/style.css';
import './reactflow.css';

import PageNode from './nodes/PageNode';
import ActionNode from './nodes/ActionNode';
import DecisionNode from './nodes/DecisionNode';
import { UserFlowToolbar } from './UserFlowToolbar';
import { NodeDetailsSidebar } from './NodeDetailsSidebar';
import { getSampleNodes, getSampleEdges } from './sampleFlowData';
import { exportFlowAsPng } from './exportHelpers';
import { toast } from '@/components/ui/use-toast';

// Define custom node types
const nodeTypes = {
  page: PageNode,
  action: ActionNode,
  decision: DecisionNode,
};

interface UserFlowDiagramProps {
  projectId: string;
}

function FlowDiagram({ projectId }: UserFlowDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const flowRef = useRef<HTMLDivElement>(null);
  
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);
  
  // Load sample data when component mounts
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // In a real app, you'd fetch data from an API
      // For now, using sample data
      const initialNodes = getSampleNodes(projectId);
      const initialEdges = getSampleEdges(projectId);
      
      setTimeout(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
        setIsLoading(false);
      }, 1000); // Simulated loading delay
    } catch (error) {
      console.error('Error loading flow data:', error);
      setIsLoading(false);
    }
  }, [projectId, setNodes, setEdges]);
  
  // Handle node click to show details
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, []);
  
  // Close sidebar
  const onCloseSidebar = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  const toggleLock = useCallback(() => {
    setIsLocked(!isLocked);
  }, [isLocked]);
  
  // Handle export
  const handleExport = useCallback(async () => {
    try {
      toast({
        title: "Exporting Diagram",
        description: "Preparing PNG image...",
      });
      
      await exportFlowAsPng(flowRef.current, 'UbahCrypt');
      
      toast({
        title: "Export Successful",
        description: "User flow diagram has been downloaded as a PNG image.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the diagram.",
        variant: "destructive"
      });
    }
  }, []);
  
  // Show loading indicator while data is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-black/20">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-indigo-500 border-solid rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white text-sm">Loading flow diagram...</div>
        </div>
      </div>
    );
  }
  
  // Use inline styles to ensure the container has proper dimensions
  return (
    <div 
      style={{ width: '100%', height: '100%', minHeight: '600px', position: 'relative' }} 
      className="bg-black/20 rounded-lg border border-gray-800"
      ref={flowRef}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-right" className="bg-black/40 border border-gray-800 rounded-md p-1" />
        <MiniMap 
          className="bg-black/40 border border-gray-800 rounded-md overflow-hidden"
          nodeColor={(node) => {
            switch(node.data.status) {
              case 'live': return '#10b981';
              case 'in-development': return '#f59e0b';
              default: return '#64748b';
            }
          }}
        />
        <Background color="#2a2a2a" gap={24} />
        
        <UserFlowToolbar isLocked={isLocked} toggleLock={toggleLock} onDownload={handleExport} />
      </ReactFlow>
      
      {selectedNode && (
        <NodeDetailsSidebar 
          nodeId={selectedNode}
          nodes={nodes}
          onClose={onCloseSidebar}
          projectId={projectId}
        />
      )}
    </div>
  );
}

// Wrap with ReactFlowProvider to ensure context is available
export function UserFlowDiagram(props: UserFlowDiagramProps) {
  return (
    <div className="h-[600px] w-full"> {/* Ensure parent component has fixed height */}
      <ReactFlowProvider>
        <FlowDiagram {...props} />
      </ReactFlowProvider>
    </div>
  );
}
