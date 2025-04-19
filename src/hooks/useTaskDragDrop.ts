
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
  
  const HOUR_HEIGHT = isMobile ? 60 : 80;
  const MINUTES_IN_HOUR = 60;

  const calculateTimeFromPosition = (y: number) => {
    const totalMinutes = Math.round((y / HOUR_HEIGHT) * MINUTES_IN_HOUR);
    const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
    const minutes = Math.round((totalMinutes % MINUTES_IN_HOUR) / 5) * 5; // Round to nearest 5 minutes
    
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time;
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = '0.7';
      dragImage.style.position = 'absolute';
      dragImage.style.left = '-1000px';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, offsetY: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    try {
      // Snap to 5-minute intervals for more precise positioning
      const newStartTime = calculateTimeFromPosition(offsetY);
      
      await updateTaskMutation.mutateAsync({
        id: taskId,
        start_time: newStartTime.toISOString()
      });

      toast({
        title: "Task scheduled",
        description: `Task has been scheduled for ${newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error scheduling task",
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver
  };
}
