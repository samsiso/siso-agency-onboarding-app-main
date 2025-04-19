
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Task } from '@/types/task.types';
import { Clock, Calendar, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriorityBadge } from './PriorityBadge';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { TaskDetailDrawer } from './TaskDetailDrawer';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UpcomingTaskCardProps {
  task: Task;
  onDragSuccess?: (task: Task) => void;
}

export function UpcomingTaskCard({ task, onDragSuccess }: UpcomingTaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  
  // Generate a lighter background color based on priority
  const getPriorityBackground = () => {
    switch (task.priority) {
      case 'urgent': return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50';
      case 'high': return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50';
      case 'medium': return 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/50';
      default: return 'bg-slate-50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/50';
    }
  };

  const handleDragStartWithCallback = (e: React.DragEvent) => {
    handleDragStart(e, task);
  };

  const handleDragEndWithCallback = (e: React.DragEvent) => {
    handleDragEnd();
    if (e.dataTransfer.dropEffect === 'move' && onDragSuccess) {
      onDragSuccess(task);
    }
  };
  
  return (
    <>
      <Card 
        draggable
        onDragStart={handleDragStartWithCallback}
        onDragEnd={handleDragEndWithCallback}
        className={cn(
          "p-3 cursor-grab active:cursor-grabbing transition-all duration-200",
          "border shadow-sm hover:shadow-md",
          "hover:border-purple-300 dark:hover:border-purple-700",
          getPriorityBackground()
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <PriorityBadge priority={task.priority} />
              {task.due_date && (
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Due: {format(new Date(task.due_date), 'MMM d')}</span>
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-sm sm:text-base mb-1.5 line-clamp-2">
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {task.description}
              </p>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => setShowDetailDrawer(true)}
                >
                  View Details
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDetailDrawer(true)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      // This would be implemented to actually schedule the task
                      if (onDragSuccess) onDragSuccess(task);
                    }}
                  >
                    Schedule Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>

      <TaskDetailDrawer
        task={task}
        isOpen={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
      />
    </>
  );
}
