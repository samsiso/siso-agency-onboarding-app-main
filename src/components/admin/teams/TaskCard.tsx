
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { SubtaskList } from './SubtaskList';
import { Progress } from '@/components/ui/progress';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
}

export function TaskCard({ task, currentHour }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [isExpanded, setIsExpanded] = useState(false);
  const startTime = task.start_time ? new Date(task.start_time) : null;
  const duration = task.duration || 60;

  const subtasks = [
    { id: '1', title: 'Review agenda', completed: true },
    { id: '2', title: 'Check emails', completed: false },
    { id: '3', title: 'Update task status', completed: false },
    { id: '4', title: 'Prepare for standup', completed: false },
  ];

  const getTaskPosition = () => {
    if (!startTime) return {};
    const minutes = startTime.getHours() * 60 + startTime.getMinutes();
    const baseHeight = (duration / 60) * 80; // 80px per hour
    const minHeight = 100; // Minimum height for content
    const heightInPixels = Math.max(baseHeight, minHeight);
    
    return {
      top: `${(minutes / 1440) * 100}%`,
      height: `${heightInPixels}px`,
      width: 'calc(100% - 1rem)' // Leave space for scrollbar
    };
  };

  const isCurrentTask = startTime && currentHour === startTime.getHours();
  const isRolledOver = !!task.rolled_over_from;
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = (completedSubtasks / subtasks.length) * 100;

  const handleToggleSubtask = (id: string) => {
    console.log('Toggle subtask:', id);
  };

  return (
    <Card 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      className={cn(
        "absolute p-3 transition-all duration-200 cursor-move",
        "hover:ring-2 hover:ring-purple-500/50 backdrop-blur-sm",
        "rounded-lg border shadow-lg",
        "flex flex-col justify-between",
        isCurrentTask 
          ? 'bg-purple-500/20 border-purple-500/50' 
          : 'bg-gray-800/50 hover:bg-gray-800/70',
        isRolledOver && 'border-l-4 border-l-amber-500'
      )}
      style={getTaskPosition()}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base truncate">{task.title}</h3>
              {isRolledOver && (
                <Badge variant="outline" className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/30">
                  <RefreshCcw className="h-3 w-3" />
                  Rolled
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
              {startTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(startTime, 'h:mm a')}
                  {duration && <span className="text-xs">· {duration}m</span>}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs">3</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-800/50 rounded-full transition-colors shrink-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        <Progress value={progress} className="h-1" />

        {isExpanded && (
          <SubtaskList 
            subtasks={subtasks}
            onToggle={handleToggleSubtask}
          />
        )}
      </div>
    </Card>
  );
}
