
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Sparkles, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminControlsProps {
  showFetchHistory: boolean;
  setShowFetchHistory: (show: boolean) => void;
  showTestPanel: boolean;
  setShowTestPanel: (show: boolean) => void;
  onTestFetch: () => void;
}

// [Analysis] Created a consolidated admin controls component to clean up the UI
export function AdminControls({
  showFetchHistory,
  setShowFetchHistory,
  showTestPanel,
  setShowTestPanel,
  onTestFetch
}: AdminControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 h-8 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50">
            <Shield className="h-4 w-4" />
            Admin Controls
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowFetchHistory(!showFetchHistory)}>
            <CalendarClock className="h-4 w-4 mr-2" />
            {showFetchHistory ? 'Hide Fetch History' : 'Show Fetch History'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTestPanel(!showTestPanel)}>
            <Sparkles className="h-4 w-4 mr-2" />
            {showTestPanel ? 'Hide Test Panel' : 'Show Test Panel'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onTestFetch}>
            <CalendarClock className="h-4 w-4 mr-2" />
            Test News Fetch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/50 gap-1">
        <Shield className="h-3 w-3" />
        Admin
      </Badge>
    </div>
  );
}
