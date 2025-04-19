import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useTasks } from '@/hooks/useTasks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Task } from '@/types/task.types';
import { TimelineColumn } from './TimelineColumn';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, ListTodo, RefreshCcw, Calendar, ArrowUpRight } from 'lucide-react';
import { useDayPeriod } from '@/hooks/useDayPeriod';
import { Badge } from '@/components/ui/badge';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { TaskCard } from './TaskCard';
import { UpcomingTaskCard } from './UpcomingTaskCard';

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

  // Sort upcoming tasks by priority
  const upcomingTasks = sisoTasks
    .filter(task => !task.start_time && task.status !== 'completed')
    .sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99);
    });

  useEffect(() => {
    const rolledOver = dailyTasks.filter(task => !!task.rolled_over_from);
    setRolledOverTasks(rolledOver);
  }, [dailyTasks]);

  const handleDragTask = (task: Task) => {
    toast({
      title: "Task scheduled",
      description: `"${task.title}" has been added to your schedule.`,
    });
  };

  const recurringTasks = dailyTasks.filter(task => task.recurring_type && task.recurring_type !== 'none');
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

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
              {greeting === 'Good Morning' ? <Clock className="h-5 w-5 sm:h-6 sm:w-6" /> : greeting === 'Good Afternoon' ? <Clock className="h-5 w-5 sm:h-6 sm:w-6" /> : <Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
              {greeting}, SISO
            </h1>
            <div className="flex flex-wrap items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        <Card className="p-3 sm:p-4 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              <h2 className="text-base sm:text-lg font-semibold truncate">
                Schedule for {isMobile ? format(today, 'MMM d') : formattedDate}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs">
              {recurringTasks.length > 0 && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <RefreshCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{recurringTasks.length} recurring</span>
                </div>
              )}
              <div className="text-xs text-muted-foreground hidden sm:block">
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

          <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto hide-scrollbar relative">
            {isDailyTasksLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
              </div>
            ) : (
              <TimelineColumn tasks={todaysTasks} />
            )}
          </div>
        </Card>
        
        
        <Card className="p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            Upcoming Tasks
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            SISO App Development Tasks - Drag tasks to the timeline to schedule them
          </p>
          
          {isSisoTasksLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-pulse text-muted-foreground">Loading tasks...</div>
            </div>
          ) : (
            <ScrollArea className="h-[300px] sm:h-[520px] w-full relative">
              <div className="space-y-3 pr-6">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      onDragSuccess={handleDragTask}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming SISO App tasks
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
}
