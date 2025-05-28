import { memo } from 'react';
// import { Handle, Position, NodeProps } from 'reactflow';

// Temporarily disabled to fix rendering issues
// Using 'any' type as a temporary fix while ReactFlow is disabled
export const ActionNode = memo(({ data, isConnectable }: any) => {
  // Determine background color based on status
  const getBackgroundColor = () => {
    switch (data.status) {
      case 'live':
        return 'bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 border-indigo-500/30';
      case 'development':
        return 'bg-gradient-to-br from-purple-800/50 to-purple-900/50 border-purple-500/30';
      case 'planned':
      default:
        return 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-500/30';
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (data.status) {
      case 'live':
        return <div className="bg-indigo-500/80 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white">Live</div>;
      case 'development':
        return <div className="bg-purple-500/80 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white">In Dev</div>;
      case 'planned':
      default:
        return <div className="bg-gray-500/80 rounded-sm px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white">Planned</div>;
    }
  };

  return (
    <div className={`px-4 py-3 rounded-md border ${getBackgroundColor()} shadow-lg min-w-[180px]`}>
      {/* Top Handle */}
      {/* Temporarily commented out to fix React Flow issues
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      {/* className="w-3 h-3 bg-purple-500/80 border-2 border-purple-700" */}
      
      <div className="flex items-center justify-between mb-1">
        {getStatusBadge()}
        <div className="bg-black/30 rounded-full p-1">
          <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      
      <div className="text-white font-medium text-sm">{data.label}</div>
      
      {data.description && (
        <div className="text-white/70 text-xs mt-1 line-clamp-2">{data.description}</div>
      )}
      
      {/* Bottom Handle */}
      {/* Temporarily commented out to fix React Flow issues
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      /> */}
      {/* className="w-3 h-3 bg-purple-500/80 border-2 border-purple-700" */}
    </div>
  );
});

ActionNode.displayName = 'ActionNode';
