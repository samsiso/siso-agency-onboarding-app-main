
import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollapsedProjectCardProps {
  projectName: string;
  onClick: () => void;
}

export function CollapsedProjectCard({ projectName, onClick }: CollapsedProjectCardProps) {
  // Get the first letter or shortened name for display
  const getShortName = (name: string) => {
    if (!name) return 'P';
    
    const words = name.split(' ');
    if (words.length === 1) {
      return name.substring(0, 3);
    }
    
    // Get first letter of each word (up to 3 letters)
    return words.slice(0, 3).map(word => word[0]).join('');
  };
  
  const shortName = getShortName(projectName);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className="w-full h-10 flex items-center justify-center my-2 bg-siso-bg-alt hover:bg-siso-bg-alt/80 border border-siso-border"
          >
            <FolderOpen className="h-4 w-4 text-siso-orange" />
            <span className="sr-only">{projectName}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{projectName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
