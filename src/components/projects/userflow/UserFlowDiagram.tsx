import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ActivitySquare, ArrowRightCircle, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Simplified interface for the placeholder
interface UserFlowDiagramProps {
  projectId: string;
  onNodeSelect?: (node: any) => void;
  setIsLoading?: (loading: boolean) => void;
}

// Temporarily providing a simplified placeholder component until React Flow is implemented
export function UserFlowDiagram({ projectId, onNodeSelect, setIsLoading }: UserFlowDiagramProps) {
  // Handle loading state if setIsLoading is provided
  if (setIsLoading) {
    // This ensures any parent component knows we're not actually loading
    setIsLoading(false);
  }
  
  return (
    <div className="h-full rounded-lg border border-white/10 bg-gradient-to-b from-black/30 to-black/10 flex flex-col items-center justify-center py-16">
      <div className="max-w-xl text-center px-6">
        <div className="w-16 h-16 rounded-xl bg-indigo-900/30 text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
          <Workflow className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">User Flow Coming Soon</h2>
        
        <div className="mb-6">
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Coming in Next Update</Badge>
        </div>
        
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          We're working on implementing a powerful flow diagram to visualize your app's user journey. This feature will be available in the next update.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-6 max-w-md mx-auto">
          <div className="bg-black/30 rounded p-3 border border-white/10">
            <h4 className="text-white text-sm font-medium mb-1">Map User Journeys</h4>
            <p className="text-xs text-gray-400">Visualize complete user flows and interactions</p>
          </div>
          
          <div className="bg-black/30 rounded p-3 border border-white/10">
            <h4 className="text-white text-sm font-medium mb-1">Screen Connections</h4>
            <p className="text-xs text-gray-400">Link screens together with logical transitions</p>
          </div>
          
          <div className="bg-black/30 rounded p-3 border border-white/10">
            <h4 className="text-white text-sm font-medium mb-1">Export Options</h4>
            <p className="text-xs text-gray-400">Share diagrams with your team in various formats</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "The User Flow feature will be available in the next update.",
            });
          }}
        >
          Check Status
        </Button>
      </div>
    </div>
  );
}
