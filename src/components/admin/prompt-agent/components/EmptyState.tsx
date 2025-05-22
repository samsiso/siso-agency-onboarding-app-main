import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, RefreshCcw, Edit } from 'lucide-react';
import { autoPromptsService } from '@/utils/auto-prompts-service';

interface EmptyStateProps {
  project: string;
  onRefresh: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ project, onRefresh }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="rounded-full bg-blue-100 p-3 mb-4">
        <Database className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">No prompts found</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        There are no prompts in the database for project "{project}". 
        Try checking the table name and data in Supabase.
      </p>
      <div className="text-xs text-muted-foreground mb-4 p-2 bg-muted rounded-md text-left max-w-md">
        <p>Debug Info:</p>
        <p>• Primary table: ui_prompts</p>
        <p>• Alternative table: project_prompts</p>
        <p>• Looking for project: {project}</p>
        <p>• Also tried variations including "Ubahcrypt"</p>
        <p>• Tried both tables with all variations</p>
        <p>• Check browser console for detailed logs</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button 
          variant="default"
          onClick={() => {
            const tableName = prompt("Enter correct table name:", "project_prompts");
            if (tableName) {
              alert(`To update the table name, edit src/utils/auto-prompts-service.ts and change TABLE_NAME to '${tableName}'`);
            }
          }}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Table Name
        </Button>
      </div>
    </div>
  );
}; 