
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GeneratePromptProps {
  onGenerate: () => void;
  isAdmin: boolean;
}

export function GeneratePrompt({ onGenerate, isAdmin }: GeneratePromptProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {isAdmin ? (
        <>
          <Sparkles className="h-16 w-16 text-purple-400 mb-4 opacity-60" />
          <h3 className="text-lg font-medium mb-2">Generate Daily AI News Summary</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Create an AI-powered summary of today's AI news articles to highlight key developments, industry impacts, and actionable insights.
          </p>
          <Button 
            onClick={onGenerate} 
            className="bg-purple-700 hover:bg-purple-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Summary
          </Button>
        </>
      ) : (
        <Alert variant="default" className="bg-purple-950/20 border-purple-500/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No AI summary is available for this date yet. Please check back later or contact an administrator.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
