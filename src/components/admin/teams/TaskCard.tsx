
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { PriorityBadge } from './PriorityBadge';
import { TaskDetailDrawer } from './task-detail/TaskDetailDrawer';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
  allTasks?: Task[];
}

export function TaskCard({ task, currentHour, allTasks = [] }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const startTime = task.start_time ? new Date(task.start_time) : null;
  const duration = task.duration || 60; // Default to 1 hour if no duration specified
  const rowStart = startTime ? startTime.getHours() + 1 : 1; // Grid rows start at 1
  const rowSpan = Math.ceil(duration / 60); // Convert minutes to hours, rounded up

  // Check if this is the current task based on start time and current hour
  const isCurrentTask = currentHour !== undefined && startTime && 
                       startTime.getHours() === currentHour;

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailDrawer(true);
  };

  // Mock progress calculation - replace with real progress tracking
  const progress = task.status === 'completed' ? 100 : 
                  task.status === 'in_progress' ? 60 : 
                  0;

  // Get priority-based background color
  const getPriorityBackground = () => {
    switch (task.priority) {
      case 'urgent': return 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30';
      case 'high': return 'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30';
      case 'medium': return 'bg-purple-500/20 border-purple-500/50 hover:bg-purple-500/30';
      default: return 'bg-gray-800/50 hover:bg-gray-800/70';
    }
  };

  return (
    <>
      <Card 
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onDragEnd={handleDragEnd}
        onClick={handleTaskClick}
        className={cn(
          "absolute left-4 right-4 p-2 sm:p-3 transition-all duration-200",
          "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
          "rounded-lg border shadow-lg touch-manipulation cursor-pointer",
          "flex flex-col justify-between gap-2 pointer-events-auto",
          isCurrentTask ? 'bg-purple-500/20 border-purple-500/50' : getPriorityBackground(),
          "z-10"
        )}
        style={{
          top: `${rowStart * 96}px`,
          minHeight: `${rowSpan * 96}px`
        }}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm sm:text-base line-clamp-2">
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
          </div>
          
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
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
