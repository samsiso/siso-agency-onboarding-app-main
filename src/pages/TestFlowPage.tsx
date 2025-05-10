import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  ReactFlowProvider
} from 'reactflow';

// Import styles separately with error handling
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: { label: 'Output Node' },
    position: { x: 400, y: 100 },
    type: 'output',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

function TestFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '500px', border: '1px solid #333' }}>
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

// Wrap with provider to ensure context is available
export default function TestFlowPage() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4 text-white">React Flow Test</h1>
        <p className="mb-4 text-gray-300">This is a simple test to check if React Flow is working properly.</p>
        <ReactFlowProvider>
          <TestFlow />
        </ReactFlowProvider>
      </div>
    </div>
  );
} 