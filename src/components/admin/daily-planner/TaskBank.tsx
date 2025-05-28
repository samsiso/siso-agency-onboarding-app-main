
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Task } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskBankProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

export function TaskBank({ tasks, onStatusChange }: TaskBankProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Circle className="h-5 w-5 text-slate-300" />;
    }
  };

  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-amber-500/10 text-amber-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[150px]">Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} className="group">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newStatus = task.status === 'completed' 
                        ? 'pending'
                        : task.status === 'pending'
                        ? 'in_progress'
                        : 'completed';
                      onStatusChange(task.id, newStatus);
                    }}
                  >
                    {getStatusIcon(task.status)}
                  </Button>
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell className="capitalize">{task.category}</TableCell>
                <TableCell>
                  <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getPriorityClass(task.priority))}>
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>
                  {task.due_date 
                    ? new Date(task.due_date).toLocaleDateString() 
                    : 'No due date'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
