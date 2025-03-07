
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, RefreshCw, Server, AlertTriangle } from 'lucide-react';

interface NewsApiStatusProps {
  apiUsage: number;
  lastSync: string | null;
  articleCount: number;
  syncingNews: boolean; // Added required prop
}

// [Analysis] Provides transparency about API usage and database status
export function NewsApiStatus({ 
  apiUsage, 
  lastSync, 
  articleCount, 
  syncingNews 
}: NewsApiStatusProps) {
  return (
    <Card className="bg-gray-900/30 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">API Status</span>
          </div>
          
          {syncingNews && (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>Syncing...</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">API Usage</span>
              <span className="text-xs">{apiUsage.toFixed(1)}%</span>
            </div>
            <Progress value={apiUsage} className="h-1" />
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Database: <span className="text-foreground">{articleCount} articles</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Last Updated: <span className="text-foreground">{lastSync || 'Never'}</span>
            </span>
          </div>
        </div>
        
        {apiUsage > 80 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span>API usage nearing limit. Consider upgrading your plan.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
