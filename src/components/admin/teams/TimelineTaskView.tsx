
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@/types/task.types';
import { TimelineColumn } from './TimelineColumn';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Plus, ListTodo, RefreshCcw, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { format } from 'date-fns';
import { useDayPeriod } from '@/hooks/useDayPeriod';

interface TimelineTaskViewProps {
  memberId?: string;
}

export function TimelineTaskView({ memberId }: TimelineTaskViewProps) {
  const { useTaskQuery } = useTasks();
  const { data: dailyTasks = [], isLoading: isDailyTasksLoading } = useTaskQuery('daily');
  const { data: sisoTasks = [], isLoading: isSisoTasksLoading } = useTaskQuery('siso_app_dev');
  const { greeting, icon: DayPeriodIcon, gradientClass } = useDayPeriod();
  const { morningCheckInTime, eveningCheckOutTime } = useCheckInOut();
  const [rolledOverTasks, setRolledOverTasks] = useState<Task[]>([]);
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  const recurringTasks = dailyTasks.filter(task => task.recurring_type && task.recurring_type !== 'none');
  const today = new Date();

  // Format times
  const morningCheckInTimeStr = format(morningCheckInTime, 'h:mm a');
  const eveningCheckOutTimeStr = format(eveningCheckOutTime, 'h:mm a');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-r ${greeting === 'Good Morning' ? 'from-purple-500 to-blue-500' : greeting === 'Good Afternoon' ? 'from-yellow-500 to-orange-500' : 'from-purple-800 to-indigo-800'} p-4 sm:p-6 rounded-lg border border-purple-500/20`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              {greeting === 'Good Morning' ? <Calendar className="h-5 w-5 sm:h-6 sm:w-6" /> : greeting === 'Good Afternoon' ? <Calendar className="h-5 w-5 sm:h-6 sm:w-6" /> : <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />}
              {greeting}, Task Schedule
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-white">
                <ListTodo className="h-3 w-3" />
                <span>Today's Tasks: {todaysTasks.length}</span>
              </div>
              {recurringTasks.length > 0 && (
                <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-white">
                  <RefreshCcw className="h-3 w-3" />
                  <span>Recurring: {recurringTasks.length}</span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-xs font-medium text-white">
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 mr-1">
                  Check-in
                </Badge>
                {morningCheckInTimeStr}
                <span className="mx-1">•</span>
                <Badge variant="outline" className="bg-white/10 text-white border-white/20 mr-1">
                  Check-out
                </Badge>
                {eveningCheckOutTimeStr}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Card className="p-3 sm:p-4 overflow-hidden">
        <div className="max-h-[600px] sm:max-h-[650px] overflow-y-auto hide-scrollbar relative">
          {isDailyTasksLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
            </div>
          ) : (
            <TimelineColumn tasks={todaysTasks} />
          )}
        </div>
      </Card>
    </div>
  );
}
