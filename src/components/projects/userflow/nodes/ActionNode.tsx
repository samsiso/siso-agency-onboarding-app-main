import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

function ActionNode({ data }: NodeProps) {
  return (
    <div className={`px-4 py-2 rounded-md shadow-md ${
      data.status === 'live' 
        ? 'bg-blue-800/60 border border-blue-500/50' 
        : data.status === 'in-development'
        ? 'bg-purple-800/60 border border-purple-500/50'
        : 'bg-slate-800/60 border border-slate-500/50'
    }`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white/80" />
      <div className="text-white font-semibold">{data.label}</div>
      {data.description && (
        <div className="text-xs text-white/70 mt-1">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white/80" />
    </div>
  );
}

export default memo(ActionNode);
