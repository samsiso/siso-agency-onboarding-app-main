import { Task } from '@/types/task.types';
import { useIsMobile } from './use-mobile';

interface TaskPosition {
  top: number;
  left: number;
  height: number;
  width: string;
}

export function useTaskPositioning() {
  const isMobile = useIsMobile();
  const HOUR_HEIGHT = 100; // Consistent height with TimelineRuler
  const MINUTES_IN_HOUR = 60;
  const CARD_MIN_HEIGHT = 60; // Minimum card height
  const HORIZONTAL_OFFSET = 4; // Percentage offset for overlapping tasks

  const calculateTaskPosition = (task: Task, overlappingTasks: Task[] = []): TaskPosition => {
    if (!task.start_time) {
      return { top: 0, left: 0, height: CARD_MIN_HEIGHT, width: '95%' };
    }

    const startTime = new Date(task.start_time);
    const minutes = startTime.getHours() * MINUTES_IN_HOUR + startTime.getMinutes();
    const duration = task.duration || 60;
    
    // Calculate vertical position and height
    const pixelsPerMinute = HOUR_HEIGHT / MINUTES_IN_HOUR;
    const topPosition = minutes * pixelsPerMinute;
    const heightInPixels = Math.max(duration * pixelsPerMinute, CARD_MIN_HEIGHT);

    // Handle overlapping tasks
    const baseWidth = isMobile ? 90 : 95; // Base width percentage
    let leftOffset = 0;
    
    if (overlappingTasks.length > 0) {
      // Find this task's index among overlapping tasks (sorted by ID to keep consistent)
      const sortedTasks = [...overlappingTasks, task].sort((a, b) => a.id.localeCompare(b.id));
      const taskIndex = sortedTasks.findIndex(t => t.id === task.id);
      
      // Calculate offset based on task's position in the sorted overlapping tasks
      leftOffset = taskIndex * HORIZONTAL_OFFSET;
      
      // Adjust width based on number of overlapping tasks
      const adjustedWidth = baseWidth - ((sortedTasks.length - 1) * HORIZONTAL_OFFSET);
      
      return {
        top: topPosition,
        left: leftOffset,
        height: heightInPixels,
        width: `${Math.max(adjustedWidth, 60)}%` // Ensure minimum width
      };
    }

    return {
      top: topPosition,
      left: leftOffset,
      height: heightInPixels,
      width: `${baseWidth}%`
    };
  };

  const findOverlappingTasks = (tasks: Task[], currentTask: Task): Task[] => {
    if (!currentTask.start_time) return [];
    
    const currentStart = new Date(currentTask.start_time).getTime();
    const currentDuration = currentTask.duration || 60; // Default to 1 hour
    const currentEnd = currentStart + (currentDuration * 60000); // Convert minutes to milliseconds

    // Find tasks that overlap in time
    return tasks.filter(task => {
      if (!task.start_time || task.id === currentTask.id) return false;
      
      const taskStart = new Date(task.start_time).getTime();
      const taskDuration = task.duration || 60;
      const taskEnd = taskStart + (taskDuration * 60000);

      return (currentStart < taskEnd && currentEnd > taskStart);
    });
  };

  return {
    calculateTaskPosition,
    findOverlappingTasks
  };
}
