
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
  className?: string;
}

export function SubtaskList({ subtasks, onToggle, className }: SubtaskListProps) {
  const completedCount = subtasks.filter(task => task.completed).length;
  const progress = (completedCount / subtasks.length) * 100;

  return (
    <div className={cn("space-y-3", className)}>
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
            <button 
              className="p-2 -m-2 rounded-full hover:bg-accent" 
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.(subtask.id);
              }}
              aria-label={subtask.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {subtask.completed ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <span className={cn(
              "flex-1",
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
