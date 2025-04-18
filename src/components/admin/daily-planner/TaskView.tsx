import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks, TaskCategory, TaskPriority, TaskStatus } from '@/hooks/useTasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Filter, PlusCircle, Search } from 'lucide-react';
import { DailyTasksSection } from './DailyTasksSection';
import { TaskBank } from './TaskBank';
import { TaskCreationDialog } from './TaskCreationDialog';

export function TaskView() {
  const { useTaskQuery, useCreateTask, useUpdateTask } = useTasks();
  const [category, setCategory] = useState<TaskCategory>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useTaskQuery(category);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const handleStatusChange = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    updateTaskMutation.mutate(
      { id: taskId, status: newStatus },
      {
        onSuccess: () => {
          toast({ 
            title: 'Task Updated', 
            description: 'Task status has been updated successfully' 
          });
        },
        onError: () => {
          toast({ 
            title: 'Error', 
            description: 'Failed to update task status', 
            variant: 'destructive' 
          });
        }
      }
    );
  };

  const handleCreateTask = async (formData: FormData) => {
    const newTask = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as TaskCategory,
      priority: formData.get('priority') as TaskPriority,
      due_date: formData.get('due_date') as string,
      status: 'pending' as const
    };

    createTaskMutation.mutate(newTask, {
      onSuccess: () => {
        toast({ 
          title: 'Task Created', 
          description: 'Your task has been added successfully' 
        });
        setShowCreateDialog(false);
      },
      onError: () => {
        toast({ 
          title: 'Error', 
          description: 'Failed to create task', 
          variant: 'destructive' 
        });
      }
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Task Manager</CardTitle>
            <CardDescription>
              Manage your {category.split('_').join(' ')} tasks
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={(val: TaskCategory) => setCategory(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Tasks</SelectItem>
                <SelectItem value="weekly">Weekly Tasks</SelectItem>
                <SelectItem value="daily">Daily Tasks</SelectItem>
                <SelectItem value="siso_app_dev">SISO App Dev</SelectItem>
                <SelectItem value="onboarding_app">Onboarding App</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              className="gap-1"
              onClick={() => setShowCreateDialog(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            <TaskBank 
              tasks={filteredTasks} 
              onStatusChange={handleStatusChange}
            />
          </div>
        </CardContent>
      </Card>

      <TaskCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
