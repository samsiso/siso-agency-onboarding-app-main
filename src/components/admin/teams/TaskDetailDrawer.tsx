
import React from 'react';
import { Task } from '@/types/task.types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { SubtaskList } from './SubtaskList';
import { PriorityBadge } from './PriorityBadge';
import { cn } from '@/lib/utils';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  if (!task) return null;

  const startTime = task.start_time ? new Date(task.start_time) : null;
  const isRolledOver = !!task.rolled_over_from;

  // Test subtasks data (you should replace this with real data from your task)
  const subtasks = [
    { id: '1', title: 'Review agenda', completed: false },
    { id: '2', title: 'Check emails', completed: false },
    { id: '3', title: 'Update task status', completed: false },
    { id: '4', title: 'Prepare for standup', completed: false },
  ];

  const handleSubtaskToggle = (id: string) => {
    // Implement subtask toggle functionality
    console.log('Toggle subtask:', id);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold">{task.title}</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={task.priority} />
              {isRolledOver && (
                <Badge variant="outline" className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/30">
                  <RefreshCcw className="h-3 w-3" />
                  Rolled Over
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              {startTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{format(startTime, 'h:mm a')}</span>
                  {task.duration && (
                    <span className="text-sm">· {task.duration}m</span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(task.created_at), 'MMM d, yyyy')}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>3 members assigned</span>
              </div>
            </div>

            {task.description && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Description</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            )}

            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Subtasks</h3>
              <SubtaskList 
                subtasks={subtasks}
                onToggle={handleSubtaskToggle}
                className="bg-background/95 backdrop-blur"
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
