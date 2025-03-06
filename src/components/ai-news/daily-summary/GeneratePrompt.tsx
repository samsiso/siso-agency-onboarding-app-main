
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles } from 'lucide-react';

interface GeneratePromptProps {
  formattedDate: string;
  articleCount: number;
  isAdmin: boolean;
  generating: boolean;
  onGenerate: () => void;
}

// [Analysis] Extracted component for empty state with generate action
export function GeneratePrompt({
  formattedDate,
  articleCount,
  isAdmin,
  generating,
  onGenerate
}: GeneratePromptProps) {
  return (
    <div className="text-center py-6 space-y-4">
      <div className="flex flex-col items-center">
        <Calendar className="h-12 w-12 text-purple-500 mb-3" />
        <h3 className="text-lg font-medium">No summary available for {formattedDate}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          {articleCount > 0 
            ? `There are ${articleCount} articles published, but no summary has been generated yet.`
            : 'There are no articles or summary available for this date.'}
        </p>
      </div>
      
      {isAdmin && articleCount > 0 && (
        <Button 
          onClick={onGenerate} 
          disabled={generating}
          className="bg-purple-700 hover:bg-purple-600"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {generating ? 'Generating Summary...' : 'Generate Summary'}
        </Button>
      )}
    </div>
  );
}
