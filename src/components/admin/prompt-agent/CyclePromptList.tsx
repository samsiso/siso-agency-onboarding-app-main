import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AutoPrompt, CycleStep, CYCLE_STEP_LABELS } from '@/types/auto-prompts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';

interface CyclePromptListProps {
  prompts: AutoPrompt[];
  cycleStep: CycleStep;
  onPromptClick?: (prompt: AutoPrompt) => void;
  onAddPrompt?: () => void;
}

export const CyclePromptList: React.FC<CyclePromptListProps> = ({
  prompts,
  cycleStep,
  onPromptClick,
  onAddPrompt
}) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {CYCLE_STEP_LABELS[cycleStep]} Prompts
        </h3>
        {onAddPrompt && (
          <Button size="sm" onClick={onAddPrompt}>
            <Plus className="w-4 h-4 mr-1" />
            Add Prompt
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        {prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-center p-4 border-2 border-dashed rounded-lg">
            <MessageSquare className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No prompts for this step yet</p>
            {onAddPrompt && (
              <Button variant="ghost" className="mt-2" onClick={onAddPrompt}>
                Add your first prompt
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onPromptClick?.(prompt)}
              >
                <CardContent className="p-4">
                  <p className="line-clamp-3">{prompt.prompt}</p>
                  {prompt.response && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p className="line-clamp-2">{prompt.response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}; 