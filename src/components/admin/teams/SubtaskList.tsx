
import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle?: (id: string) => void;
}

export function SubtaskList({ subtasks, onToggle }: SubtaskListProps) {
  const completedCount = subtasks.filter(task => task.completed).length;
  const progress = (completedCount / subtasks.length) * 100;

  return (
    <div className="space-y-3 mt-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-1" />
      <ul className="space-y-2">
        {subtasks.map(subtask => (
          <li
            key={subtask.id}
            className="flex items-center gap-2 text-sm"
            onClick={() => onToggle?.(subtask.id)}
          >
            {subtask.completed ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={cn(
              subtask.completed && "line-through text-muted-foreground"
            )}>
              {subtask.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
