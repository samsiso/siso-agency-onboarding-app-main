
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TimelineColumn } from './TimelineColumn';
import { Task } from '@/types/task.types';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, ListTodo, RefreshCcw, Calendar, ArrowUpRight } from 'lucide-react';
import { useDayPeriod } from '@/hooks/useDayPeriod';
import { Badge } from '@/components/ui/badge';
import { useCheckInOut } from '@/hooks/useCheckInOut';

export function TimelineTaskView({ memberId }: { memberId?: string }) {
  const { useTaskQuery } = useTasks();
  const { data: tasks = [] } = useTaskQuery('daily', memberId);
  const { greeting, icon: DayPeriodIcon, gradientClass } = useDayPeriod();
  const { morningCheckInTime, eveningCheckOutTime } = useCheckInOut();
  const [rolledOverTasks, setRolledOverTasks] = useState<Task[]>([]);

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

  // Determine rolled-over tasks
  useEffect(() => {
    const rolledOver = tasks.filter(task => !!task.rolled_over_from);
    setRolledOverTasks(rolledOver);
  }, [tasks]);

  const recurringTasks = tasks.filter(task => task.recurring_type && task.recurring_type !== 'none');
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

  // Format times
  const morningCheckInTimeStr = format(morningCheckInTime, 'h:mm a');
  const eveningCheckOutTimeStr = format(eveningCheckOutTime, 'h:mm a');

  // Test task for SISO Agency App Dev
  const testTask: Task = {
    id: 'test-task',
    title: 'SISO Agency App Development',
    description: 'Work on core features and improvements',
    status: 'in_progress',
    priority: 'high',
    category: 'siso_app_dev',
    created_at: new Date().toISOString(),
    start_time: (() => {
      const time = new Date();
      time.setHours(10, 0, 0, 0);
      return time.toISOString();
    })(),
    duration: 60
  };

  const allTasks = [...tasks, testTask].sort((a, b) => {
    if (!a.start_time || !b.start_time) return 0;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-r ${gradientClass} p-6 rounded-lg border border-purple-500/20`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <DayPeriodIcon className="h-6 w-6" />
              {greeting}, SISO
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
              {rolledOverTasks.length > 0 && (
                <div className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Rolled Over: {rolledOverTasks.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Schedule for {formattedDate}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {recurringTasks.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <RefreshCcw className="h-4 w-4" />
                  <span>{recurringTasks.length} recurring</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 mr-1">
                  Check-in
                </Badge>
                {morningCheckInTimeStr}
                <span className="mx-1">•</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 mr-1">
                  Check-out
                </Badge>
                {eveningCheckOutTimeStr}
              </div>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto hide-scrollbar relative">
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
              <TaskCard 
                key={task.id} 
                task={task}
                allTasks={upcomingTasks}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
