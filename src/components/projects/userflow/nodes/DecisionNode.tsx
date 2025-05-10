import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

function DecisionNode({ data }: NodeProps) {
  return (
    <div className="w-32 h-32 flex items-center justify-center transform rotate-45">
      <div className={`w-full h-full flex items-center justify-center ${
        data.status === 'live' 
          ? 'bg-indigo-800/60 border border-indigo-500/50' 
          : data.status === 'in-development'
          ? 'bg-pink-800/60 border border-pink-500/50'
          : 'bg-slate-800/60 border border-slate-500/50'
      }`}>
        <div className="transform -rotate-45 text-center p-2">
          <div className="text-white font-semibold text-sm">{data.label}</div>
          {data.description && (
            <div className="text-xs text-white/70 mt-1">{data.description}</div>
          )}
        </div>
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white/80 -translate-y-[16px] -translate-x-[16px]" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white/80 translate-y-[16px] translate-x-[16px]" />
        <Handle type="source" position={Position.Left} className="w-3 h-3 bg-white/80 -translate-y-[16px] -translate-x-[16px]" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white/80 translate-y-[16px] translate-x-[16px]" />
      </div>
    </div>
  );
}

export default memo(DecisionNode); 