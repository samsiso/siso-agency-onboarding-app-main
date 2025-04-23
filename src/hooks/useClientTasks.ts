
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Task } from '@/types/task.types';

export function useClientTasks(clientId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuthSession();
  
  useEffect(() => {
    if (!user) {
      setError('Authentication required to view tasks');
      setLoading(false);
      return;
    }
    
    const fetchTasks = async () => {
      try {
        setError(null);
        let query = supabase.from('tasks').select('*');

        if (clientId) {
          query = query.eq('assigned_client_id', clientId);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }
        
        setTasks(data || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load tasks';
        setError(message);
        toast({
          variant: "destructive",
          title: "Error loading tasks",
          description: message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, toast, user]);

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: "Task status has been updated successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating task",
        description: "Failed to update task status. Please try again."
      });
    }
  };

  return {
    tasks,
    loading,
    error,
    updateTaskStatus
  };
}
