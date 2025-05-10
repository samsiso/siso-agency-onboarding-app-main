import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';

interface SimpleUserFlowDiagramProps {
  projectId: string;
}

// Basic nodes without custom types
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Login/Signup' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Onboarding' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Dashboard' },
    position: { x: 250, y: 200 },
  },
  {
    id: '4',
    data: { label: 'Wallet' },
    position: { x: 100, y: 300 },
  },
  {
    id: '5',
    data: { label: 'Trading' },
    position: { x: 400, y: 300 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
];

function SimpleFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export function SimpleUserFlowDiagram(props: SimpleUserFlowDiagramProps) {
  return (
    <div className="h-[600px] w-full bg-black/20 border border-gray-800 rounded-md">
      <ReactFlowProvider>
        <SimpleFlow />
      </ReactFlowProvider>
    </div>
  );
} 