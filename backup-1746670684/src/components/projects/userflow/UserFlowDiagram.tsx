import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Simplified interface for the placeholder
interface UserFlowDiagramProps {
  projectId: string;
  onNodeSelect?: (node: any) => void;
  setIsLoading?: (loading: boolean) => void;
}

// Temporarily providing a simplified placeholder component until React Flow issues are fixed
export function UserFlowDiagram({ projectId, onNodeSelect, setIsLoading }: UserFlowDiagramProps) {
  // Handle loading state if setIsLoading is provided
  if (setIsLoading) {
    // This ensures any parent component knows we're not actually loading
    setIsLoading(false);
  }
  
  return (
    <div className="flex items-center justify-center h-full bg-black/20 rounded-lg border border-gray-800 p-8">
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">User Flow Visualization</h3>
        <p className="text-gray-400 text-sm mb-4">
          The React Flow integration is currently being fixed. This feature will be available soon.
        </p>
        <Button 
          variant="outline" 
          className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30"
          onClick={() => {
            toast({
              title: "Coming Soon",
              description: "The User Flow feature is currently under maintenance.",
            });
          }}
        >
          Check Status
        </Button>
      </div>
    </div>
  );
}
