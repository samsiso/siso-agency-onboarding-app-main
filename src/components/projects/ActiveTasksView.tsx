
import { useState } from 'react';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";
import { TaskCard } from './TaskCard';
import { TaskDetailsDialog } from './TaskDetailsDialog';
import { useClientTasks } from '@/hooks/useClientTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/hooks/use-toast';

const taskStatuses = [
  { id: "1", name: "To Do", color: "#6B7280" },
  { id: "2", name: "In Progress", color: "#F59E0B" },
  { id: "3", name: "Completed", color: "#10B981" },
];

export function ActiveTasksView() {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const { tasks, loading, error, updateTaskStatus } = useClientTasks();
  const { user } = useAuthSession();
  const { toast } = useToast();

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || !user) return;

    const task = tasks.find(t => t.id === active.id);
    if (!task) return;

    const newStatus = over.id === 'To Do' ? 'pending' :
                     over.id === 'In Progress' ? 'in_progress' :
                     'completed';

    await updateTaskStatus(task.id, newStatus);
  };

  // Add the missing handleUpdateTask function
  const handleUpdateTask = async (updatedTask: any) => {
    try {
      if (!updatedTask || !updatedTask.id) return;

      // Map status from UI format to database format
      const dbStatus = updatedTask.status?.name === 'To Do' ? 'pending' :
                      updatedTask.status?.name === 'In Progress' ? 'in_progress' :
                      updatedTask.status?.name === 'Completed' ? 'completed' :
                      updatedTask.status?.name;

      await updateTaskStatus(updatedTask.id, dbStatus);
      
      setSelectedTask(null);
      toast({
        title: "Task updated",
        description: "Task details have been updated successfully."
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error updating task",
        description: "Failed to update task details. Please try again."
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error loading tasks</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please sign in to view your tasks.
        </AlertDescription>
      </Alert>
    );
  }

  if (!tasks.length) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No tasks found</AlertTitle>
        <AlertDescription>
          No tasks are currently assigned to you or your client.
        </AlertDescription>
      </Alert>
    );
  }

  console.log('Rendering tasks in Kanban:', tasks);

  return (
    <div className="p-4">
      <TaskDetailsDialog
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleUpdateTask}
      />
      
      <KanbanProvider onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskStatuses.map((status) => (
            <KanbanBoard 
              key={status.name} 
              id={status.name}
              className="bg-black/20 border-[#403E43]/30 hover:border-[#403E43]/50"
            >
              <KanbanHeader name={status.name} color={status.color} />
              <KanbanCards>
                {tasks
                  .filter((task) => {
                    const taskStatus = task.status.name;
                    return (status.name === 'To Do' && taskStatus === 'pending') ||
                           (status.name === 'In Progress' && taskStatus === 'in_progress') ||
                           (status.name === 'Completed' && taskStatus === 'completed');
                  })
                  .map((task, index) => (
                    <KanbanCard
                      key={task.id}
                      id={task.id}
                      name={task.name}
                      parent={status.name}
                      index={index}
                      className="bg-transparent shadow-none p-0"
                    >
                      <TaskCard
                        {...task}
                        onClick={() => setSelectedTask(task)}
                      />
                    </KanbanCard>
                  ))}
              </KanbanCards>
            </KanbanBoard>
          ))}
        </div>
      </KanbanProvider>
    </div>
  );
}
