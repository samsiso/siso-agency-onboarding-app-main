
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, Calendar, Users, RefreshCcw, Edit2, 
  Plus, Trash2, Check, AlignLeft, Tag, 
  Calendar as CalendarIcon, ArrowRight
} from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { SubtaskList } from './SubtaskList';
import { PriorityBadge } from './PriorityBadge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  
  const { useUpdateTask } = useTaskOperations();
  const { mutate: updateTask } = useUpdateTask();
  const { toast } = useToast();
  
  const startTime = task?.start_time ? new Date(task.start_time) : null;
  const dueDate = task?.due_date ? new Date(task.due_date) : null;
  const isRolledOver = !!task?.rolled_over_from;
  const isOverdue = dueDate ? !isFuture(dueDate) && task?.status !== 'completed' : false;

  const [subtasks, setSubtasks] = useState([
    { id: '1', title: 'Research requirements', completed: true },
    { id: '2', title: 'Create mockups', completed: false },
    { id: '3', title: 'Implementation', completed: false },
    { id: '4', title: 'Testing', completed: false },
  ]);

  const handleSaveChanges = () => {
    if (!task) return;
    
    updateTask(
      { 
        id: task.id, 
        title: editedTitle,
        description: editedDescription 
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({
            title: "Task updated",
            description: "The task has been updated successfully.",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update task: " + error.message,
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

  const handleScheduleTask = () => {
    if (!task) return;
    
    const now = new Date();
    const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(roundedMinutes, 0, 0);
    
    updateTask(
      { 
        id: task.id, 
        start_time: now.toISOString(),
        duration: 60 // Default to 1 hour
      },
      {
        onSuccess: () => {
          toast({
            title: "Task scheduled",
            description: `"${task.title}" scheduled for ${format(now, 'h:mm a')}.`,
          });
          onClose();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to schedule task.",
          });
        },
      }
    );
  };

  const handleMarkAsComplete = () => {
    if (!task) return;
    
    updateTask(
      { 
        id: task.id, 
        status: task.status === 'completed' ? 'pending' : 'completed'
      },
      {
        onSuccess: () => {
          toast({
            title: task.status === 'completed' ? "Task reopened" : "Task completed",
            description: task.status === 'completed' 
              ? `"${task.title}" has been reopened.` 
              : `"${task.title}" has been marked as complete.`,
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update task status.",
          });
        },
      }
    );
  };

  if (!task) return null;

  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="max-w-md mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle className="text-center text-xl">Task Details</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 py-2 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Title and description section */}
            <div className="space-y-3">
              {isEditing ? (
                <>
                  <div>
                    <label htmlFor="task-title" className="text-sm font-medium mb-1 block">
                      Title
                    </label>
                    <Input
                      id="task-title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full"
                      placeholder="Task title"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="task-description" className="text-sm font-medium mb-1 block">
                      Description
                    </label>
                    <Textarea
                      id="task-description"
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full"
                      placeholder="Task description"
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold break-words pr-2">{task.title}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-accent rounded-full flex-shrink-0"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  
                  {task.description && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlignLeft className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="break-words">{task.description}</p>
                    </div>
                  )}
                </>
              )}
            </div>
                
            <Separator />
            
            {/* Status and metadata section */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 mb-2">
                <PriorityBadge priority={task.priority} />
                
                <Badge 
                  variant={task.status === 'completed' ? 'success' : 
                          task.status === 'in_progress' ? 'warning' : 'outline'}
                  className="flex items-center gap-1"
                >
                  {task.status === 'completed' ? 
                    <Check className="h-3 w-3" /> : 
                    <Clock className="h-3 w-3" />
                  }
                  {task.status === 'completed' ? 'Completed' : 
                   task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                </Badge>
                
                {task.category && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-500 border-blue-200">
                    <Tag className="h-3 w-3" />
                    {task.category.replace(/_/g, ' ')}
                  </Badge>
                )}
                
                {isRolledOver && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-500 border-amber-200">
                    <ArrowRight className="h-3 w-3" />
                    Rolled Over
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                {startTime && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Start Time</p>
                      <p className="font-medium">{format(startTime, 'h:mm a')}</p>
                    </div>
                  </div>
                )}
                
                {dueDate && (
                  <div className="flex items-start gap-2">
                    <CalendarIcon className={cn(
                      "h-4 w-4 mt-0.5",
                      isOverdue ? "text-red-500" : "text-muted-foreground"
                    )} />
                    <div>
                      <p className={cn(
                        "text-muted-foreground",
                        isOverdue && "text-red-500"
                      )}>
                        {isOverdue ? "Overdue" : "Due Date"}
                      </p>
                      <p className={cn(
                        "font-medium",
                        isOverdue && "text-red-500"
                      )}>
                        {format(dueDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                
                {task.duration && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">
                        {task.duration >= 60 
                          ? `${task.duration / 60} hour${task.duration > 60 ? 's' : ''}` 
                          : `${task.duration} min`}
                      </p>
                    </div>
                  </div>
                )}
                
                {task.recurring_type && task.recurring_type !== 'none' && (
                  <div className="flex items-start gap-2">
                    <RefreshCcw className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Recurrence</p>
                      <p className="font-medium capitalize">{task.recurring_type}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            {/* Subtasks section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Subtasks ({completedSubtasks}/{subtasks.length})</h3>
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
              />
            </div>
          </div>
          
          <DrawerFooter className="pt-2">
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {!startTime && (
                  <Button 
                    variant="secondary"
                    onClick={handleScheduleTask}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </Button>
                )}
                
                <Button 
                  variant={task.status === 'completed' ? "outline" : "default"}
                  onClick={handleMarkAsComplete}
                  className={cn(
                    "flex items-center gap-2",
                    task.status === 'completed' ? "col-span-2" : startTime ? "col-span-2" : ""
                  )}
                >
                  <Check className="h-4 w-4" />
                  {task.status === 'completed' ? "Reopen Task" : "Mark Complete"}
                </Button>
              </div>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
