import { useState } from 'react';
import { Node } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NodeDetailsSidebarProps {
  nodeId: string;
  nodes: Node[];
  onClose: () => void;
  projectId: string;
}

export function NodeDetailsSidebar({ nodeId, nodes, onClose, projectId }: NodeDetailsSidebarProps) {
  const navigate = useNavigate();
  const node = nodes.find(n => n.id === nodeId);
  
  if (!node) return null;
  
  const goToWireframe = () => {
    if (node.data.details?.wireframeId) {
      navigate(`/projects/${projectId}/wireframe`);
      onClose();
    }
  };
  
  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-black/50 border-l border-gray-800 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Node Details</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <span className="text-xs text-gray-400">Type</span>
          <p className="text-white capitalize">{node.type}</p>
        </div>
        
        <div>
          <span className="text-xs text-gray-400">Label</span>
          <p className="text-white">{node.data.label}</p>
        </div>
        
        {node.data.description && (
          <div>
            <span className="text-xs text-gray-400">Description</span>
            <p className="text-white">{node.data.description}</p>
          </div>
        )}
        
        <div>
          <span className="text-xs text-gray-400">Status</span>
          <Badge className={`
            ${node.data.status === 'live' ? 'bg-emerald-600/80' : 
              node.data.status === 'in-development' ? 'bg-amber-600/80' : 
              'bg-slate-600/80'}
          `}>
            {node.data.status === 'live' ? 'Live' :
             node.data.status === 'in-development' ? 'In Development' :
             'Planned'}
          </Badge>
        </div>
        
        {/* Display additional details if available */}
        {node.data.details?.wireframeId && (
          <div>
            <span className="text-xs text-gray-400">Wireframe</span>
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-400 hover:text-blue-300 flex items-center gap-1"
              onClick={goToWireframe}
            >
              <FileCode className="w-3 h-3" />
              <span>View Wireframe</span>
            </Button>
          </div>
        )}
        
        {node.data.details?.implementationNotes && (
          <div>
            <span className="text-xs text-gray-400">Implementation Notes</span>
            <p className="text-white text-sm mt-1 bg-black/30 p-2 rounded border border-gray-800">
              {node.data.details.implementationNotes}
            </p>
          </div>
        )}
        
        {node.data.details?.requirements && node.data.details.requirements.length > 0 && (
          <div>
            <span className="text-xs text-gray-400">Requirements</span>
            <ul className="text-white text-sm mt-1 space-y-1">
              {node.data.details.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-500 text-xs mt-0.5">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
