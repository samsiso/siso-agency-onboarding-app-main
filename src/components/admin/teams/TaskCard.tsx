import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { PriorityBadge } from './PriorityBadge';
import { useTaskPositioning } from '@/hooks/useTaskPositioning';
import { TaskDetailDrawer } from './task-detail/TaskDetailDrawer';
import { GripVertical } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
  allTasks?: Task[];
}

export function TaskCard({ task, currentHour, allTasks = [] }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const { calculateTaskPosition, findOverlappingTasks } = useTaskPositioning();
  const [isHovered, setIsHovered] = useState(false);
  
  // Find overlapping tasks
  const overlappingTasks = findOverlappingTasks(allTasks, task);
  
  // Calculate position based on start time and overlapping tasks
  const { top, left, height, width } = calculateTaskPosition(task, overlappingTasks);
  
  const startTime = task.start_time ? new Date(task.start_time) : null;
  
  // Format time display
  const timeDisplay = startTime 
    ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "absolute p-2 sm:p-3 transition-all duration-200",
          "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
          "rounded-lg border shadow-md touch-manipulation cursor-pointer",
          "flex flex-col justify-between gap-2 pointer-events-auto",
          isCurrentTask ? 'bg-purple-500/20 border-purple-500/50' : getPriorityBackground(),
          "z-10 animate-fade-in"
        )}
        style={{
          top: `${top}px`,
          left: `${left}%`,
          height: `${height}px`,
          width,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
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
          </div>
          
          <div 
            className={cn(
              "h-full cursor-grab active:cursor-grabbing",
              "px-1 -my-2 -mr-2 flex items-center opacity-0 transition-opacity",
              isHovered && "opacity-100"
            )}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="mt-auto space-y-2">
          {timeDisplay && (
            <div className="text-xs font-medium text-muted-foreground">
              {timeDisplay}
            </div>
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
