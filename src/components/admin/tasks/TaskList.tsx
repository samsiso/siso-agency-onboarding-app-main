
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  category: 'main' | 'weekly' | 'daily';
}

export function TaskList({ category }: TaskListProps) {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load tasks</AlertDescription>
      </Alert>
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
