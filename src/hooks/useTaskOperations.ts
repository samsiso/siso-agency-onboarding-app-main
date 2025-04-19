
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task.types';

export function useTaskOperations() {
  const queryClient = useQueryClient();

  const useCreateTask = () => {
    return useMutation({
      mutationFn: async (newTask: Omit<Task, 'id' | 'created_at'>) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('You must be logged in to create tasks');
        }
        console.log('Creating new task:', newTask);
        
        const { data, error } = await supabase
          .from('tasks')
          .insert({ 
            ...newTask, 
            created_by: user?.id
          } as any)
          .select()
          .maybeSingle();
        
        if (error) {
          console.error('Error creating task:', error);
          if (error.message.includes('violates row-level security')) {
            throw new Error('You do not have permission to create this task');
          }
          throw error;
        }
        if (!data) {
          console.error('Failed to create task - no data returned');
          throw new Error('Failed to create task');
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      }
    });
  };

  const useUpdateTask = () => {
    return useMutation({
      mutationFn: async (updatedTask: Partial<Task> & { id: string }) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('You must be logged in to update tasks');
        }

        console.log('Updating task:', updatedTask);
        
        // First verify the task exists and user has permission
        const { data: existingTask, error: checkError } = await supabase
          .from('tasks')
          .select('id, created_by, assigned_to')
          .eq('id', updatedTask.id)
          .maybeSingle();
          
        if (checkError) {
          console.error('Error checking task existence:', checkError);
          throw new Error('Failed to verify task access');
        }
        
        if (!existingTask) {
          console.error(`Task with id ${updatedTask.id} not found`);
          throw new Error('Task not found');
        }

        // Check if user has permission
        if (existingTask.created_by !== user.id && existingTask.assigned_to !== user.id) {
          throw new Error('You do not have permission to update this task');
        }

        const { data, error } = await supabase
          .from('tasks')
          .update(updatedTask as any)
          .eq('id', updatedTask.id)
          .select()
          .maybeSingle();
        
        if (error) {
          console.error('Error updating task:', error);
          if (error.message.includes('violates row-level security')) {
            throw new Error('You do not have permission to update this task');
          }
          throw error;
        }
        if (!data) {
          console.error(`Task update failed - no data returned for id ${updatedTask.id}`);
          throw new Error('Failed to update task');
        }
        return data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: ['taskStats'] });
      }
    });
  };

  return {
    useCreateTask,
    useUpdateTask
  };
}

export type { Task };
