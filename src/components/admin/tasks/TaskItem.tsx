
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '@/hooks/useTasks';

interface TaskItemProps {
  task: Task;
}

const priorityColors = {
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-500 border-red-500/20'
};

export function TaskItem({ task }: TaskItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        <Checkbox checked={task.status === 'completed'} />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{task.title}</h3>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
              </div>
            )}
            
            {task.assigned_to && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Assigned to {task.assigned_to}</span>
              </div>
            )}
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </div>
    </Card>
  );
}
