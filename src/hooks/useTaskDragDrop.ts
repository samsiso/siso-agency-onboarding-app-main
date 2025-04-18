
import { useState } from 'react';
import { useTasks, Task } from '@/hooks/useTasks';
import { format } from 'date-fns';

export function useTaskDragDrop() {
  const { useUpdateTask } = useTasks();
  const updateTaskMutation = useUpdateTask();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    // Calculate the new start time based on the drop position
    const today = new Date();
    today.setHours(hour, 0, 0, 0);

    await updateTaskMutation.mutateAsync({
      id: taskId,
      start_time: today.toISOString(),
      duration: 60 // Default duration of 1 hour
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver
  };
}
