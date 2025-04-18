
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Circle, Clock, PlusCircle, Filter, MoreHorizontal, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks } from '@/hooks/useTasks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

export function TaskView() {
  const { useTaskQuery, useCreateTask } = useTasks();
  const [category, setCategory] = useState<'main' | 'weekly' | 'daily'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const { data: tasks = [], isLoading } = useTaskQuery(category);
  const createTaskMutation = useCreateTask();

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'completed' && task.status === 'completed') ||
                          (statusFilter === 'pending' && task.status === 'pending');
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = (formData: React.FormEvent<HTMLFormElement>) => {
    formData.preventDefault();
    const form = formData.target as HTMLFormElement;
    const titleInput = form.elements.namedItem('title') as HTMLInputElement;
    const descriptionInput = form.elements.namedItem('description') as HTMLInputElement;

    createTaskMutation.mutate(
      {
        title: titleInput.value,
        description: descriptionInput.value,
        category,
        status: 'pending',
        priority: 'medium'
      },
      {
        onSuccess: () => {
          toast({ title: 'Task Created', description: 'Your task has been added successfully' });
          form.reset();
        },
        onError: (error) => {
          toast({ 
            title: 'Error', 
            description: 'Failed to create task', 
            variant: 'destructive' 
          });
        }
      }
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Task Manager</CardTitle>
            <CardDescription>
              Manage your {category} tasks across the team
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={category} onValueChange={(val: 'main' | 'weekly' | 'daily') => setCategory(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main">Main Tasks</SelectItem>
                <SelectItem value="weekly">Weekly Tasks</SelectItem>
                <SelectItem value="daily">Daily Tasks</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <Input name="title" placeholder="Task Title" required />
                  <Input name="description" placeholder="Description (optional)" />
                  <Button type="submit">Create Task</Button>
                </form>
              </DialogContent>
            </Dialog>
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Task Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    {task.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : task.status === 'in_progress' ? (
                      <Clock className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.category}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
