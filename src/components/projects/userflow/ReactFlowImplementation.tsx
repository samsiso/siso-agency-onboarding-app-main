/**
 * DRAFT IMPLEMENTATION - TO BE USED IN NEXT UPDATE
 * 
 * This file contains a draft implementation of the ReactFlow integration
 * for the user flow visualization feature. It will be used in the next update.
 */

import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  NodeChange,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from 'reactflow';
// Uncomment when implementing:
// import 'reactflow/dist/style.css';

import { ScreenNode } from './nodes/ScreenNode';
import { ActionNode } from './nodes/ActionNode';
import { DecisionNode } from './nodes/DecisionNode';

// Custom node types
const nodeTypes = {
  screenNode: ScreenNode,
  actionNode: ActionNode,
  decisionNode: DecisionNode,
};

// Node color mapping by status
const nodeColors = {
  implemented: '#4ade80',  // green
  'in-progress': '#fb923c', // orange
  planned: '#94a3b8',      // slate
};

interface UserFlowDiagramProps {
  projectId: string;
  onNodeSelect?: (node: Node) => void;
  setIsLoading?: (loading: boolean) => void;
}

export function ReactFlowImplementation({ projectId, onNodeSelect, setIsLoading }: UserFlowDiagramProps) {
  // Sample initial data - would be loaded from API in real implementation
  const initialNodes: Node[] = [
    {
      id: 'screen-1',
      type: 'screenNode',
      position: { x: 250, y: 5 },
      data: { 
        label: 'Login Screen', 
        status: 'implemented',
        description: 'The first screen users see when opening the app',
        screenshot: null
      },
    },
    {
      id: 'screen-2',
      type: 'screenNode',
      position: { x: 250, y: 100 },
      data: { 
        label: 'Dashboard', 
        status: 'implemented',
        description: 'Main dashboard showing app features',
        screenshot: null
      },
    },
    {
      id: 'screen-3',
      type: 'screenNode',
      position: { x: 250, y: 200 },
      data: { 
        label: 'User Profile', 
        status: 'in-progress',
        description: 'User can view and edit their profile information',
        screenshot: null
      },
    },
    {
      id: 'action-1',
      type: 'actionNode',
      position: { x: 100, y: 50 },
      data: { 
        label: 'Login Button Click', 
        action: 'button_click',
        description: 'User clicks the login button after entering credentials'
      },
    },
    {
      id: 'decision-1',
      type: 'decisionNode',
      position: { x: 400, y: 150 },
      data: { 
        label: 'Is First Login?', 
        description: 'Check if this is the user\'s first login'
      },
    },
  ];

  const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'screen-1', target: 'screen-2', animated: true },
    { id: 'e2-3', source: 'screen-2', target: 'screen-3' },
    { id: 'e2-d1', source: 'screen-2', target: 'decision-1', label: 'Check' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Handle when connections are created
  const onConnect = useCallback(
    (connection: Connection) => {
      // In a real implementation, we might want to prompt the user to add details about this connection
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onNodeSelect) {
        onNodeSelect(node);
      }
    },
    [onNodeSelect]
  );

  // Save the flow
  const saveFlow = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      // In a real implementation, we would save this to the server
      console.log('Flow saved:', flow);
      // API call would go here
    }
  }, [reactFlowInstance]);

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          connectionMode={ConnectionMode.Loose}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        >
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            nodeColor={(node) => {
              const status = node.data?.status || 'planned';
              return nodeColors[status];
            }}
          />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
} 