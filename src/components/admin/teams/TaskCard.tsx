import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChevronDown, ChevronUp, RefreshCcw, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { SubtaskList } from './SubtaskList';
import { Progress } from '@/components/ui/progress';
import { PriorityBadge } from './PriorityBadge';
import { useTaskPositioning } from '@/hooks/useTaskPositioning';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TaskDetailDrawer } from './TaskDetailDrawer';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
  allTasks: Task[];
}

export function TaskCard({ task, currentHour, allTasks }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const startTime = task.start_time ? new Date(task.start_time) : null;
  const { calculateTaskPosition, findOverlappingTasks } = useTaskPositioning();
  const isMobile = useIsMobile();
  
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
  const taskDuration = task.duration || 60; // Use task.duration with a fallback to 60

  const handleTaskClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setShowDetailDrawer(true);
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
          "absolute p-2 sm:p-4 transition-all duration-200",
          "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
          "rounded-lg border shadow-lg touch-manipulation",
          "flex flex-col justify-between gap-2",
          isCurrentTask 
            ? 'bg-purple-500/20 border-purple-500/50' 
            : 'bg-gray-800/50 hover:bg-gray-800/70',
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
