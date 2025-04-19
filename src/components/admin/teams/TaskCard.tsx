
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

interface TaskCardProps {
  task: Task;
  currentHour?: number;
  allTasks: Task[];
}

export function TaskCard({ task, currentHour, allTasks }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [isExpanded, setIsExpanded] = useState(false);
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

  const isCurrentTask = startTime && currentHour === startTime.getHours();
  const isRolledOver = !!task.rolled_over_from;
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = (completedSubtasks / subtasks.length) * 100;
  const taskDuration = task.duration || 60; // Use task.duration with a fallback to 60

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <Card 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      className={cn(
        "absolute p-2 sm:p-4 transition-all duration-200",
        "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
        "rounded-lg border shadow-lg touch-manipulation",
        "flex flex-col justify-between gap-2 sm:gap-3",
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
        <div className="flex items-start gap-2">
          <div 
            className="p-1 cursor-move touch-manipulation rounded-md hover:bg-gray-700/50"
            aria-label="Drag handle"
          >
            <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-full">
                      {task.title}
                    </h3>
                  </TooltipTrigger>
                  <TooltipContent side="top">{task.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <PriorityBadge priority={task.priority} />
                {isRolledOver && (
                  <Badge variant="outline" className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-500 border-amber-500/30">
                    <RefreshCcw className="h-2 w-2 sm:h-3 sm:w-3" />
                    <span className="hidden sm:inline">Rolled</span>
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
              {startTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  {format(startTime, 'h:mm a')}
                  {task.duration && <span className="text-xs ml-1">· {task.duration}m</span>}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs">3</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1 sm:h-1.5" />
            </div>
          </div>
          
          <button 
            onClick={handleToggleExpand}
            className="p-1 sm:p-1.5 hover:bg-gray-800/50 rounded-full transition-colors shrink-0"
            aria-label={isExpanded ? "Collapse task" : "Expand task"}
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>

        {isExpanded && (
          <SubtaskList 
            subtasks={subtasks}
            onToggle={() => {}}
          />
        )}
      </div>
    </Card>
  );
}
