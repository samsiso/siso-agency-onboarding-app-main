
import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from './TaskCard';

interface TimelineTaskViewProps {
  memberId?: string;
}

export function TimelineTaskView({ memberId }: TimelineTaskViewProps) {
  const { useTaskQuery } = useTasks();
  const { data: dailyTasks = [], isLoading: isDailyTasksLoading } = useTaskQuery('daily');
  const { data: sisoTasks = [], isLoading: isSisoTasksLoading } = useTaskQuery('siso_app_dev');
  
  const todaysTasks = dailyTasks.filter(task => {
    if (!task.start_time) return false;
    const taskDate = new Date(task.start_time);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    ) || (task.recurring_type && task.recurring_type !== 'none');
  });

  const allTasks = [...todaysTasks, ...sisoTasks].sort((a, b) => {
    if (!a.start_time || !b.start_time) return 0;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  // Generate time markers for 24 hours
  const timeMarkers = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="h-full flex flex-col">
      {isDailyTasksLoading || isSisoTasksLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0 flex">
            {/* Time markers column */}
            <div className="flex-shrink-0 w-16 bg-background/80 border-r border-border z-10">
              {timeMarkers.map((time, index) => (
                <div
                  key={time}
                  className="h-24 flex items-center justify-center text-sm text-muted-foreground border-b border-border/50 last:border-b-0"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Timeline content */}
            <div className="flex-1 overflow-auto">
              <div className="relative" style={{ height: `${24 * 96}px` }}>
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-rows-24">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <div
                      key={index}
                      className="border-b border-border/50 last:border-b-0"
                    />
                  ))}
                </div>

                {/* Tasks */}
                {allTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    currentHour={new Date().getHours()}
                    allTasks={allTasks}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
