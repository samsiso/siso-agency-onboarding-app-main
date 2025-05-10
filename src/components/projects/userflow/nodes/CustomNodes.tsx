import React from 'react';
import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Node data interface
export interface CustomNodeData {
  label: string;
  description?: string;
  type?: 'screen' | 'action' | 'decision';
  metrics?: {
    views?: number;
    conversions?: number;
  };
  feedbackCount?: number;
  importance?: 'low' | 'medium' | 'high';
}

// Screen node component
export const ScreenNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className="relative rounded-lg border bg-indigo-500/10 border-indigo-500/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-indigo-500/20 hover:border-indigo-500/60 w-52">
      <Handle type="target" position={Position.Top} className="!bg-indigo-500" />
      
      {data.importance && (
        <div className="absolute -top-2 -right-2">
          <Badge className={cn(
            "text-xs px-1.5 py-0",
            data.importance === 'high' ? 'bg-red-500/80' : 
            data.importance === 'medium' ? 'bg-amber-500/80' : 
            'bg-green-500/80'
          )}>
            {data.importance}
          </Badge>
        </div>
      )}
      
      <div className="mb-1 flex items-center gap-1">
        <Badge variant="outline" className="bg-indigo-950/40 border-indigo-400/30 text-indigo-300 text-xs px-1.5">
          Screen
        </Badge>
        {data.feedbackCount && data.feedbackCount > 0 && (
          <Badge variant="outline" className="bg-purple-950/40 border-purple-400/30 text-purple-300 text-xs px-1.5 flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {data.feedbackCount}
          </Badge>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-white">{data.label}</h3>
      
      {data.description && (
        <p className="mt-1 text-xs text-gray-300 line-clamp-2">{data.description}</p>
      )}
      
      {data.metrics && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
          {data.metrics.views !== undefined && (
            <div className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" />
              <span>{data.metrics.views}</span>
            </div>
          )}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500" />
    </div>
  );
};

// Action node component
export const ActionNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className="relative rounded-lg border bg-amber-500/10 border-amber-500/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-amber-500/20 hover:border-amber-500/60 w-52">
      <Handle type="target" position={Position.Top} className="!bg-amber-500" />
      
      {data.importance && (
        <div className="absolute -top-2 -right-2">
          <Badge className={cn(
            "text-xs px-1.5 py-0",
            data.importance === 'high' ? 'bg-red-500/80' : 
            data.importance === 'medium' ? 'bg-amber-500/80' : 
            'bg-green-500/80'
          )}>
            {data.importance}
          </Badge>
        </div>
      )}
      
      <div className="mb-1 flex items-center gap-1">
        <Badge variant="outline" className="bg-amber-950/40 border-amber-400/30 text-amber-300 text-xs px-1.5">
          Action
        </Badge>
        {data.feedbackCount && data.feedbackCount > 0 && (
          <Badge variant="outline" className="bg-purple-950/40 border-purple-400/30 text-purple-300 text-xs px-1.5 flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {data.feedbackCount}
          </Badge>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-white">{data.label}</h3>
      
      {data.description && (
        <p className="mt-1 text-xs text-gray-300 line-clamp-2">{data.description}</p>
      )}
      
      {data.metrics && data.metrics.conversions !== undefined && (
        <div className="mt-2 flex items-center gap-0.5 text-xs text-gray-400">
          <ArrowRight className="h-3 w-3" />
          <span>{data.metrics.conversions}% conversion</span>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!bg-amber-500" />
    </div>
  );
};

// Decision node component
export const DecisionNode = ({ data }: { data: CustomNodeData }) => {
  return (
    <div className="relative rounded-lg border bg-emerald-500/10 border-emerald-500/40 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-emerald-500/20 hover:border-emerald-500/60 w-52">
      <Handle type="target" position={Position.Top} className="!bg-emerald-500" />
      
      {data.importance && (
        <div className="absolute -top-2 -right-2">
          <Badge className={cn(
            "text-xs px-1.5 py-0",
            data.importance === 'high' ? 'bg-red-500/80' : 
            data.importance === 'medium' ? 'bg-amber-500/80' : 
            'bg-green-500/80'
          )}>
            {data.importance}
          </Badge>
        </div>
      )}
      
      <div className="mb-1 flex items-center gap-1">
        <Badge variant="outline" className="bg-emerald-950/40 border-emerald-400/30 text-emerald-300 text-xs px-1.5">
          Decision
        </Badge>
        {data.feedbackCount && data.feedbackCount > 0 && (
          <Badge variant="outline" className="bg-purple-950/40 border-purple-400/30 text-purple-300 text-xs px-1.5 flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" />
            {data.feedbackCount}
          </Badge>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-white">{data.label}</h3>
      
      {data.description && (
        <p className="mt-1 text-xs text-gray-300 line-clamp-2">{data.description}</p>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500" />
      <Handle type="source" position={Position.Right} className="!bg-emerald-500" />
    </div>
  );
}; 