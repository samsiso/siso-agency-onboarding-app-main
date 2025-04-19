
import { useState } from 'react';
import { useTasks, Task } from '@/hooks/useTasks';

export function useTaskDragDrop() {
  const { useUpdateTask } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const [isDragging, setIsDragging] = useState(false);
  const HOUR_HEIGHT = 80; // Match the timeline height per hour

  const calculateTimeFromPosition = (y: number) => {
    const hourPosition = Math.floor(y / HOUR_HEIGHT);
    const minutePosition = Math.round((y % HOUR_HEIGHT) / (HOUR_HEIGHT / 60));
    
    const today = new Date();
    today.setHours(hourPosition, minutePosition, 0, 0);
    return today;
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, offsetY: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    const newStartTime = calculateTimeFromPosition(offsetY);
    console.log('New start time:', newStartTime.toLocaleTimeString());

    await updateTaskMutation.mutateAsync({
      id: taskId,
      start_time: newStartTime.toISOString()
    });
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
