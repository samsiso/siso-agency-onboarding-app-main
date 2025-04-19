
import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task.types';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from './use-mobile';

export function useTaskDragDrop() {
  const { useUpdateTask } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const HOUR_HEIGHT = 100;
  const MINUTES_IN_HOUR = 60;

  const calculateTimeFromPosition = (y: number) => {
    const totalMinutes = Math.round((y / HOUR_HEIGHT) * MINUTES_IN_HOUR);
    const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
    const minutes = Math.round((totalMinutes % MINUTES_IN_HOUR) / 15) * 15; // Snap to 15-minute intervals
    
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time;
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    const taskElement = e.currentTarget as HTMLElement;
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create and setup ghost element
    const ghost = taskElement.cloneNode(true) as HTMLElement;
    ghost.style.opacity = '0.7';
    ghost.style.position = 'absolute';
    ghost.style.left = '-9999px';
    ghost.style.top = '-9999px';
    ghost.style.width = `${taskElement.offsetWidth}px`;
    ghost.style.pointerEvents = 'none';
    
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 10, 10);
    
    // Remove ghost after drag starts
    requestAnimationFrame(() => {
      document.body.removeChild(ghost);
    });
    
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const guideLine = document.getElementById('dragGuideLine');
    if (guideLine) {
      guideLine.style.display = 'none';
    }
  };

  // Updated to accept an HTMLElement as the second parameter
  const handleDrop = async (e: React.DragEvent, scrollContainer: HTMLElement) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    try {
      const rect = scrollContainer.getBoundingClientRect();
      const scrollOffset = scrollContainer.scrollTop || 0;
      const y = e.clientY - rect.top + scrollOffset;
      
      const newStartTime = calculateTimeFromPosition(y);
      
      await updateTaskMutation.mutateAsync({
        id: taskId,
        start_time: newStartTime.toISOString()
      });

      toast({
        title: "Task rescheduled",
        description: `Task moved to ${newStartTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error rescheduling task",
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const timelineEl = e.currentTarget;
    if (timelineEl instanceof HTMLElement) {
      // Update guide line position
      const guideLine = document.getElementById('dragGuideLine');
      if (guideLine) {
        const rect = timelineEl.getBoundingClientRect();
        const scrollOffset = timelineEl.scrollTop || 0;
        const y = e.clientY - rect.top + scrollOffset;
        
        // Snap to 15-minute intervals
        const snappedY = Math.round(y / (HOUR_HEIGHT / 4)) * (HOUR_HEIGHT / 4);
        
        guideLine.style.top = `${snappedY}px`;
        guideLine.style.display = 'block';
      }
    }
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    HOUR_HEIGHT
  };
}
