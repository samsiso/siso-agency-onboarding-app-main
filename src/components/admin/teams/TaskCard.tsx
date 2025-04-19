
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChevronDown, ChevronUp, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { SubtaskList } from './SubtaskList';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
}

export function TaskCard({ task, currentHour }: TaskCardProps) {
  const { handleDragStart, handleDragEnd } = useTaskDragDrop();
  const [isExpanded, setIsExpanded] = useState(false);
  const startTime = task.start_time ? new Date(task.start_time) : null;
  const duration = task.duration || 60;

  // Mock subtasks - in a real app, these would come from the task data
  const subtasks = [
    { id: '1', title: 'Review agenda', completed: true },
    { id: '2', title: 'Check emails', completed: false },
    { id: '3', title: 'Update task status', completed: false },
    { id: '4', title: 'Prepare for standup', completed: false },
  ];

  const getTaskPosition = () => {
    if (!startTime) return {};
    const minutes = startTime.getHours() * 60 + startTime.getMinutes();
    return {
      top: `${(minutes / 1440) * 100}%`,
      height: `${Math.max((duration / 1440) * 100, 3)}%`,
      minHeight: '80px'
    };
  };

  const isCurrentTask = startTime && currentHour === startTime.getHours();
  const isRolledOver = !!task.rolled_over_from;

  const handleToggleSubtask = (id: string) => {
    // In a real app, this would update the subtask status in the database
    console.log('Toggle subtask:', id);
  };

  return (
    <Card 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      className={cn(
        "absolute left-0 right-2 p-4 transition-all duration-200 cursor-move hover:ring-2 hover:ring-purple-500/50",
        isCurrentTask ? 'bg-purple-500/20 border-purple-500/50' : 'bg-gray-800/50 hover:bg-gray-800/70',
        isRolledOver && 'border-l-4 border-l-amber-500'
      )}
      style={getTaskPosition()}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base">{task.title}</h3>
              {isRolledOver && (
                <Badge variant="outline" className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/30">
                  <RefreshCcw className="h-3 w-3" />
                  Rolled over
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {startTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(startTime, 'h:mm a')}
                  {duration && ` · ${duration}m`}
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>3 participants</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-800/50 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

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
