
import React from 'react';
import { Card } from '@/components/ui/card';
import { TimelineColumn } from './TimelineColumn';
import { Task } from '@/types/task.types';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { TaskCard } from './TaskCard';
import { motion } from 'framer-motion';
import { Clock, ListTodo, RefreshCcw } from 'lucide-react';

export function TimelineTaskView({ memberId }: { memberId?: string }) {
  const { useTaskQuery } = useTasks();
  const { data: tasks = [] } = useTaskQuery('daily', memberId);

  const todaysTasks = tasks.filter(task => {
    if (!task.start_time) return false;
    return format(new Date(task.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ||
           (task.recurring_type && task.recurring_type !== 'none');
  });

  const upcomingTasks = tasks.filter(task => {
    if (!task.due_date || task.start_time) return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    return dueDate > today && format(dueDate, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd');
  });

  const recurringTasks = tasks.filter(task => task.recurring_type && task.recurring_type !== 'none');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-indigo-900/40 p-6 rounded-lg border border-purple-500/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome, SISO
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                <ListTodo className="h-3 w-3" />
                <span>Today's Tasks: {todaysTasks.length}</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                <Clock className="h-3 w-3" />
                <span>Upcoming Tasks: {upcomingTasks.length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today's Schedule</h2>
            {recurringTasks.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <RefreshCcw className="h-4 w-4" />
                <span>{recurringTasks.length} recurring</span>
              </div>
            )}
          </div>
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar">
            <TimelineColumn tasks={todaysTasks} />
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Drag tasks to the timeline to schedule them
          </p>
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar space-y-4">
            {upcomingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
