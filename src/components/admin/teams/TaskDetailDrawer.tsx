
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, RefreshCcw, Edit2, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { SubtaskList } from './SubtaskList';
import { PriorityBadge } from './PriorityBadge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const { useUpdateTask } = useTaskOperations();
  const { mutate: updateTask } = useUpdateTask();
  const { toast } = useToast();
  const startTime = task?.start_time ? new Date(task.start_time) : null;
  const isRolledOver = !!task?.rolled_over_from;

  const [subtasks, setSubtasks] = useState([
    { id: '1', title: 'Review agenda', completed: false },
    { id: '2', title: 'Check emails', completed: false },
    { id: '3', title: 'Update task status', completed: false },
    { id: '4', title: 'Prepare for standup', completed: false },
  ]);

  const handleTitleSave = () => {
    if (!task) return;
    
    updateTask(
      { id: task.id, title: editedTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({
            title: "Task updated",
            description: "The task title has been updated successfully.",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update task title.",
          });
        },
      }
    );
  };

  const handleSubtaskToggle = (id: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, title: 'New subtask', completed: false }]);
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  if (!task) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[85vh]">
        <div className="mx-auto w-full max-w-sm">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <button 
                    onClick={handleTitleSave}
                    className="px-3 py-1 bg-green-500/10 text-green-500 rounded-md hover:bg-green-500/20"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-accent rounded-full"
                  >
                    <Edit2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={task.priority} />
              {isRolledOver && (
                <Badge variant="outline" className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/30">
                  <RefreshCcw className="h-3 w-3" />
                  Rolled Over
                </Badge>
              )}
            </div>

            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Subtasks</h3>
                <button
                  onClick={handleAddSubtask}
                  className="p-1 hover:bg-accent rounded-full"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <SubtaskList 
                subtasks={subtasks}
                onToggle={handleSubtaskToggle}
                onDelete={handleDeleteSubtask}
                className="bg-background/95 backdrop-blur"
              />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
