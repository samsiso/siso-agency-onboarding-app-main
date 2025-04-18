
import React from 'react';
import { useTasks, TaskCategory, Task } from '@/hooks/useTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaskItem } from './TaskItem';
import { useToast } from '@/components/ui/use-toast';

interface TaskListProps {
  category: TaskCategory;
}

export function TaskList({ category }: TaskListProps) {
  const { useTaskQuery } = useTasks();
  const { toast } = useToast();
  const { data: tasks, isLoading, error } = useTaskQuery(category);

  React.useEffect(() => {
    if (error) {
      console.error('Task fetching error:', error);
      toast({
        variant: "destructive",
        title: "Error loading tasks",
        description: error instanceof Error ? error.message : "Failed to load tasks"
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No {category} tasks found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
