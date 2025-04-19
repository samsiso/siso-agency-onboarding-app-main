
import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task.types';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from './use-mobile';

export function useTaskDragDrop() {
  const { useUpdateTask } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const HOUR_HEIGHT = isMobile ? 60 : 100;
  const MINUTES_IN_HOUR = 60;
  const SNAP_INTERVAL = 5; // Snap to 5-minute intervals

  const calculateTimeFromPosition = (y: number) => {
    const totalMinutes = Math.round((y / HOUR_HEIGHT) * MINUTES_IN_HOUR);
    
    // Snap to intervals (e.g., 5 minutes)
    const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
    const minutes = Math.floor(totalMinutes % MINUTES_IN_HOUR / SNAP_INTERVAL) * SNAP_INTERVAL;
    
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time;
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    setDraggedTask(task);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50', 'ring-2', 'ring-purple-500');
      
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.opacity = '0.7';
      dragImage.style.position = 'absolute';
      dragImage.style.left = '-1000px';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 10, 10);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    setDraggedTask(null);
    
    // Remove visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50', 'ring-2', 'ring-purple-500');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Update current drag position for visual indicators
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDrop = async (e: React.DragEvent, offsetY: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;
    
    try {
      // Calculate new time based on drop position (with snapping)
      const newStartTime = calculateTimeFromPosition(offsetY);
      
      // Update the task with new start time
      await updateTaskMutation.mutateAsync({
        id: taskId,
        start_time: newStartTime.toISOString()
      });

      toast({
        title: "Task rescheduled",
        description: `Task moved to ${newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error scheduling task",
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  return {
    isDragging,
    draggedTask,
    dragPosition,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver
  };
}
