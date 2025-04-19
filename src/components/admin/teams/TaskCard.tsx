
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
  
  const overlappingTasks = findOverlappingTasks(allTasks, task);
  const position = calculateTaskPosition(task, overlappingTasks);

  const subtasks = [
    { id: '1', title: 'Review agenda', completed: true },
    { id: '2', title: 'Check emails', completed: false },
    { id: '3', title: 'Update task status', completed: false },
    { id: '4', title: 'Prepare for standup', completed: false },
  ];

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = (completedSubtasks / subtasks.length) * 100;
  const isCurrentTask = startTime && currentHour === startTime.getHours();
  const isRolledOver = !!task.rolled_over_from;

  const handleTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailDrawer(true);
  };

  // Add a function to handle drag end with callback
  const handleDragEndWithCallback = () => {
    handleDragEnd();
    // If onDragSuccess prop exists, call it when drag ends
    if (onDragSuccess) {
      onDragSuccess(task);
    }
  };

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
        onDragEnd={handleDragEndWithCallback}
        onClick={handleTaskClick}
        className={cn(
          "absolute p-2 sm:p-3 transition-all duration-200",
          "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
          "rounded-lg border shadow-lg touch-manipulation cursor-pointer",
          "flex flex-col justify-between gap-2",
          isCurrentTask 
            ? 'bg-purple-500/20 border-purple-500/50' 
            : getPriorityBackground(),
          isRolledOver && 'border-l-4 border-l-amber-500',
          !startTime && 'static'
        )}
        style={startTime ? {
          top: `${position.top}px`,
          left: `${position.left}%`,
          height: `${position.height}px`,
          width: position.width,
        } : {}}
      >
        <div className="space-y-2">
          <h3 className="font-medium text-sm sm:text-base truncate">
            {task.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <PriorityBadge priority={task.priority} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
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
