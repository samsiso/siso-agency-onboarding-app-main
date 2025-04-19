
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { PriorityBadge } from './PriorityBadge';
import { useTaskPositioning } from '@/hooks/useTaskPositioning';
import { TaskDetailDrawer } from './task-detail/TaskDetailDrawer';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
  allTasks?: Task[];
  onDragSuccess?: (task: Task) => void;
}

export function TaskCard({ task, currentHour, allTasks = [], onDragSuccess }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const startTime = task.start_time ? new Date(task.start_time) : null;
  const { calculateTaskPosition, findOverlappingTasks } = useTaskPositioning();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const overlappingTasks = findOverlappingTasks(allTasks, task);
  const position = calculateTaskPosition(task, overlappingTasks);

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
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={cn(
          "absolute p-2 sm:p-3 transition-all duration-200",
          "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
          "rounded-lg border shadow-lg touch-manipulation cursor-pointer",
          "flex flex-col justify-between gap-2",
          isCurrentTask ? 'bg-purple-500/20 border-purple-500/50' : getPriorityBackground(),
          isExpanded && 'z-50',
          !startTime && 'static'
        )}
        style={startTime ? {
          top: `${position.top}px`,
          left: `${position.left}%`,
          height: isExpanded ? 'auto' : `${position.height}px`,
          minHeight: `${position.height}px`,
          width: position.width,
          transform: isExpanded ? 'scale(1.02)' : undefined,
        } : {}}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-sm sm:text-base",
              isExpanded ? "" : "line-clamp-2"
            )}>
              {task.title}
            </h3>
            <PriorityBadge priority={task.priority} />
          </div>
          
          {task.description && (
            <p className={cn(
              "text-xs text-muted-foreground",
              isExpanded ? "" : "line-clamp-2"
            )}>
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
