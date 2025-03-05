
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Info } from 'lucide-react';

interface FetchHistoryPanelProps {
  onRefresh: () => void;
  onTestFetch: () => void;
}

export function FetchHistoryPanel({ onRefresh, onTestFetch }: FetchHistoryPanelProps) {
  return (
    <Card className="p-4 bg-card">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">News Fetch History</h3>
          <p className="text-sm text-muted-foreground">
            Review recent fetches and test updates before importing
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onTestFetch}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Test Fetch</span>
            <span className="inline sm:hidden">Test</span>
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh News</span>
            <span className="inline sm:hidden">Refresh</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
