
import React from 'react';
import { Task } from '@/types/task.types';
import { format } from 'date-fns';
import { TaskCard } from './TaskCard';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';

export function TimelineColumn({ tasks }: { tasks: Task[] }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const currentHour = new Date().getHours();
  const { handleDrop, handleDragOver, isDragging } = useTaskDragDrop();

  return (
    <div className="relative min-h-[600px]">
      {/* Time ruler */}
      <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-200">
        {timeSlots.map((hour) => (
          <div
            key={hour}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, hour)}
            className={cn(
              "h-20 flex items-center justify-center text-sm transition-colors",
              hour === currentHour && "bg-purple-100/10 font-bold",
              isDragging && "hover:bg-purple-100/5"
            )}
          >
            {format(new Date().setHours(hour), 'ha')}
          </div>
        ))}
      </div>

      {/* Tasks container */}
      <div className="ml-16 relative">
        {/* Current time indicator */}
        <div 
          className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
          style={{
            top: `${(new Date().getHours() * 60 + new Date().getMinutes()) / 1440 * 100}%`
          }}
        />

        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            currentHour={currentHour}
          />
        ))}
      </div>
    </div>
  );
}
