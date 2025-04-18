
import React from 'react';
import { Task } from '@/types/task.types';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  currentHour?: number;
}

export function TaskCard({ task, currentHour }: TaskCardProps) {
  const startTime = task.start_time ? new Date(task.start_time) : null;
  const duration = task.duration || 60; // Default 1 hour

  const getTaskPosition = () => {
    if (!startTime) return {};
    const minutes = startTime.getHours() * 60 + startTime.getMinutes();
    const top = (minutes / 1440) * 100; // Convert to percentage of day
    const height = (duration / 1440) * 100; // Convert duration to percentage

    return {
      top: `${top}%`,
      height: `${height}%`,
      minHeight: '40px'
    };
  };

  const isCurrentTask = startTime && currentHour === startTime.getHours();

  return (
    <Card 
      className={`
        absolute left-0 right-2 p-2 transition-all duration-200
        ${isCurrentTask ? 'bg-purple-500/20 border-purple-500/50' : 'bg-gray-800/50 hover:bg-gray-800/70'}
      `}
      style={getTaskPosition()}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-sm">{task.title}</h3>
          {task.start_time && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="h-3 w-3" />
              {format(new Date(task.start_time), 'h:mm a')}
              {task.duration && ` · ${task.duration}m`}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
