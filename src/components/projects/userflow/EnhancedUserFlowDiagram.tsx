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
  ReactFlowProvider,
  Panel
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
import { Button } from '@/components/ui/button';
import { QuickFeedbackDialog } from './QuickFeedbackDialog';
import { MessageCircle, Share2, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define custom node types
const nodeTypes = {
  page: PageNode,
  action: ActionNode,
  decision: DecisionNode,
};

interface EnhancedUserFlowDiagramProps {
  projectId: string;
}

function FlowDiagram({ projectId }: EnhancedUserFlowDiagramProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [feedbackNode, setFeedbackNode] = useState<{id: string, name: string} | null>(null);
  const [showMinimap, setShowMinimap] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Initialize with sample data
  useEffect(() => {
    const sampleNodes = getSampleNodes(projectId);
    const sampleEdges = getSampleEdges();
    
    // Add a small delay for loading effect
    const timer = setTimeout(() => {
      setNodes(sampleNodes);
      setEdges(sampleEdges);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [projectId, setNodes, setEdges]);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );
  
  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  };
  
  const onPaneClick = () => {
    setSelectedNode(null);
    setHighlightedPath([]);
  };
  
  const toggleLock = () => {
    setIsLocked(!isLocked);
    toast({
      title: isLocked ? "Editor Unlocked" : "Editor Locked",
      description: isLocked ? "You can now edit the diagram." : "The diagram is now in view-only mode.",
    });
  };
  
  const handleExport = () => {
    if (reactFlowWrapper.current) {
      exportFlowAsPng(reactFlowWrapper.current, `userflow-${projectId}`);
      toast({
        title: "Export Complete",
        description: "Your user flow diagram has been exported as PNG.",
      });
    }
  };
  
  const openFeedbackDialog = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setFeedbackNode({
        id: node.id,
        name: node.data.label,
      });
    }
  };
  
  const handleFeedbackSubmit = (feedback: {nodeId: string, type: string, comment: string}) => {
    console.log('Feedback submitted:', feedback);
    // In a real app, you'd send this to your API
  };
  
  // Function to find and highlight a path
  const highlightPath = (startNodeId: string) => {
    const findConnectedNodes = (nodeId: string, path: string[] = []): string[] => {
      const currentPath = [...path, nodeId];
      
      // Find all connections from this node
      const connections = edges.filter(edge => edge.source === nodeId);
      
      if (connections.length === 0) {
        return currentPath;
      }
      
      // Just take the first path for this demo
      const nextNodeId = connections[0].target;
      return findConnectedNodes(nextNodeId, currentPath);
    };
    
    const path = findConnectedNodes(startNodeId);
    setHighlightedPath(path);
    
    // Apply highlight styles
    setNodes(nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        boxShadow: path.includes(node.id) 
          ? '0 0 20px 5px rgba(99, 102, 241, 0.6)' 
          : undefined,
        opacity: path.includes(node.id) ? 1 : 0.4,
        transition: 'all 0.5s ease'
      }
    })));
    
    setEdges(edges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        stroke: path.includes(edge.source) && path.includes(edge.target)
          ? '#4f46e5'
          : '#555',
        strokeWidth: path.includes(edge.source) && path.includes(edge.target)
          ? 3
          : 1,
        opacity: path.includes(edge.source) && path.includes(edge.target)
          ? 1
          : 0.4,
        transition: 'all 0.5s ease'
      },
      animated: path.includes(edge.source) && path.includes(edge.target)
    })));
  };
  
  const resetHighlight = () => {
    setHighlightedPath([]);
    setNodes(nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        boxShadow: undefined,
        opacity: 1,
      }
    })));
    
    setEdges(edges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        stroke: undefined,
        strokeWidth: undefined,
        opacity: 1,
      },
      animated: false
    })));
  };
  
  // Add node context menu
  const NodeContextMenu = ({ nodeId }: { nodeId: string }) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    return (
      <div className="absolute z-50 bg-gray-900/95 border border-gray-700 rounded-md shadow-xl p-1 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1 min-w-[120px]"
        >
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-blue-400 hover:text-blue-300 hover:bg-blue-950/40"
            onClick={() => highlightPath(nodeId)}
          >
            <Share2 className="w-3.5 h-3.5 mr-2" />
            Trace Flow
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="justify-start text-purple-400 hover:text-purple-300 hover:bg-purple-950/40"
            onClick={() => openFeedbackDialog(nodeId)}
          >
            <MessageCircle className="w-3.5 h-3.5 mr-2" />
            Add Feedback
          </Button>
        </motion.div>
      </div>
    );
  };
  
  return (
    <div className="w-full h-[600px] relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isLocked ? undefined : onNodesChange}
        onEdgesChange={isLocked ? undefined : onEdgesChange}
        onConnect={isLocked ? undefined : onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        defaultEdgeOptions={{
          style: { stroke: '#555' },
          type: 'smoothstep',
        }}
      >
        <UserFlowToolbar 
          isLocked={isLocked} 
          toggleLock={toggleLock} 
          onDownload={handleExport}
        />
        <Controls 
          position="bottom-right"
          showInteractive={false}
        />
        
        <Panel position="top-right" className="bg-black/40 p-2 rounded-md backdrop-blur-sm border border-gray-800 shadow-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white hover:bg-white/10 px-2 h-7"
            onClick={() => setShowMinimap(!showMinimap)}
          >
            <ZoomIn className="w-3.5 h-3.5 mr-1.5" />
            {showMinimap ? 'Hide Overview' : 'Show Overview'}
          </Button>
        </Panel>
        
        {showMinimap && (
          <MiniMap 
            nodeStrokeColor={(n) => {
              if (n.data.status === 'live') return '#10b981';
              if (n.data.status === 'in-development') return '#f59e0b';
              return '#94a3b8';
            }}
            nodeColor={(n) => {
              if (n.type === 'page') return '#1e40af';
              if (n.type === 'action') return '#5b21b6';
              return '#0f766e';
            }}
            maskColor="rgba(0, 0, 0, 0.5)"
          />
        )}
        <Background gap={16} size={1} color="#334155" style={{ background: 'rgba(15, 23, 42, 0.3)' }} />
      </ReactFlow>
      
      {selectedNode && (
        <NodeDetailsSidebar 
          nodeId={selectedNode} 
          nodes={nodes} 
          onClose={() => setSelectedNode(null)} 
          projectId={projectId}
        />
      )}
      
      {selectedNode && nodes.find(n => n.id === selectedNode) && (
        <div 
          className="absolute" 
          style={{
            top: (nodes.find(n => n.id === selectedNode)?.position?.y || 0) + 60,
            left: (nodes.find(n => n.id === selectedNode)?.position?.x || 0) + 60,
          }}
        >
          <NodeContextMenu nodeId={selectedNode} />
        </div>
      )}
      
      <AnimatePresence>
        {highlightedPath.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 bg-indigo-900/70 backdrop-blur-sm p-3 rounded-lg border border-indigo-500/40 shadow-lg z-50"
          >
            <p className="text-white text-sm mb-2">Highlighted flow path:</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {highlightedPath.map((nodeId) => (
                <span 
                  key={nodeId} 
                  className="bg-indigo-500/20 border border-indigo-500/30 rounded px-2 py-0.5 text-xs text-indigo-200"
                >
                  {nodes.find(n => n.id === nodeId)?.data.label || nodeId}
                </span>
              ))}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo-300 hover:text-indigo-200 hover:bg-indigo-800/30 w-full"
              onClick={resetHighlight}
            >
              Clear Highlight
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {feedbackNode !== null && (
        <QuickFeedbackDialog
          open={feedbackNode !== null}
          onOpenChange={(open) => !open && setFeedbackNode(null)}
          nodeId={feedbackNode?.id || ''}
          nodeName={feedbackNode?.name || ''}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}

// Wrap with ReactFlowProvider to ensure context is available
export function EnhancedUserFlowDiagram(props: EnhancedUserFlowDiagramProps) {
  return (
    <div className="h-[600px] w-full bg-[#0f172a]/70 rounded-lg overflow-hidden border border-gray-800"> 
      <ReactFlowProvider>
        <FlowDiagram {...props} />
      </ReactFlowProvider>
    </div>
  );
} 