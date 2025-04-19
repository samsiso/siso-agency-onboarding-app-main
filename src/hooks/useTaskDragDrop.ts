
import { useState } from 'react';
import { useTasks, Task } from '@/hooks/useTasks';

export function useTaskDragDrop() {
  const { useUpdateTask } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const [isDragging, setIsDragging] = useState(false);
  const HOUR_HEIGHT = 80;
  const MINUTES_IN_HOUR = 60;

  const calculateTimeFromPosition = (y: number) => {
    const totalMinutes = Math.round((y / HOUR_HEIGHT) * MINUTES_IN_HOUR);
    const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR);
    const minutes = totalMinutes % MINUTES_IN_HOUR;
    
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time;
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    
    // Add visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, offsetY: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Snap to 5-minute intervals for more precise positioning
    const newStartTime = calculateTimeFromPosition(offsetY);
    const minutes = newStartTime.getMinutes();
    const roundedMinutes = Math.round(minutes / 5) * 5;
    newStartTime.setMinutes(roundedMinutes);

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
