
import React from 'react';
import { Card } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task.types';
import { TimelineColumn } from './TimelineColumn';
import { motion } from 'framer-motion';

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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-3 sm:p-4">
          {isDailyTasksLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
            </div>
          ) : (
            <TimelineColumn tasks={todaysTasks} />
          )}
        </Card>
      </motion.div>
    </div>
  );
}
