
import React from 'react';
import { Card } from '@/components/ui/card';
import { TimelineColumn } from './TimelineColumn';
import { Task } from '@/types/task.types';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { TaskCard } from './TaskCard';

export function TimelineTaskView({ memberId }: { memberId?: string }) {
  const { useTaskQuery } = useTasks();
  const { data: tasks = [] } = useTaskQuery('daily', memberId);

  const todaysTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    return format(new Date(task.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  });

  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate > today && format(dueDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
        <TimelineColumn tasks={todaysTasks} />
      </Card>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
        <div className="space-y-4">
          {upcomingTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </Card>
    </div>
  );
}
