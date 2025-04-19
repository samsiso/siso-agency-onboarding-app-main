
import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TimelineColumn } from './TimelineColumn';

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

  return (
    <div className="h-full flex flex-col">
      {isDailyTasksLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
        </div>
      ) : (
        <TimelineColumn tasks={todaysTasks} />
      )}
    </div>
  );
}
