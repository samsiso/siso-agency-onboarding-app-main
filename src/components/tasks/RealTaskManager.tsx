import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Clock, ArrowRight, User, FileText, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRealTasks, useAddTask, useUpdateTask } from '@/hooks/useRealTasks';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMainUserProject } from '@/hooks/useUserProjects';

interface RealTaskManagerProps {
  title?: string;
  className?: string;
  showAddTask?: boolean;
  maxTasks?: number;
  filterType?: 'all' | 'high-priority' | 'due-soon';
}

// Default workflow tasks for new users
const getDefaultWorkflowTasks = (navigate: (path: string) => void) => [
  {
    id: 'workflow-1',
    text: 'Enter your business information',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'high' as const,
    category: 'onboarding',
    icon: User,
    actionText: 'Start Now',
    action: () => navigate('/onboarding'),
    description: 'Set up your business profile and requirements'
  },
  {
    id: 'workflow-2', 
    text: 'Make an app plan',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'high' as const,
    category: 'planning',
    icon: FileText,
    actionText: 'Create Plan',
    action: () => navigate('/projects/new'),
    description: 'Define your app requirements and features'
  },
  {
    id: 'workflow-3',
    text: 'Review the app plan',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'medium' as const,
    category: 'review',
    icon: CheckCircle,
    actionText: 'Review Plan',
    action: () => navigate('/projects'),
    description: 'Approve your app plan and requirements'
  },
  {
    id: 'workflow-4',
    text: 'Review MVP',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'medium' as const,
    category: 'development',
    icon: Smartphone,
    actionText: 'View Progress',
    action: () => navigate('/projects'),
    description: 'Review your minimum viable product'
  }
];

export function RealTaskManager({ 
  title = "Your Tasks Today", 
  className,
  showAddTask = true,
  maxTasks = 3,
  filterType = 'all'
}: RealTaskManagerProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { tasks, remainingTasks, loading, error, hasRealTasks } = useRealTasks(filterType);
  const { project, hasProjects } = useMainUserProject();
  const { addTask } = useAddTask();
  const { updateTaskStatus, deleteTask } = useUpdateTask();
  
  const [newTaskText, setNewTaskText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get default workflow tasks for new users
  const workflowTasks = getDefaultWorkflowTasks(navigate);
  
  // Show workflow tasks if user has no projects and no real tasks
  const shouldShowWorkflowTasks = !hasProjects && !hasRealTasks && !loading;
  const displayTasks = shouldShowWorkflowTasks 
    ? workflowTasks.slice(0, maxTasks)
    : tasks.slice(0, maxTasks);

  const handleAddTask = async () => {
    if (!newTaskText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addTask(newTaskText.trim());
      setNewTaskText('');
      
      // Invalidate and refetch tasks
      await queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] });
      
      toast({
        title: "Task added",
        description: "Your task has been added successfully."
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    // Don't allow toggling workflow tasks
    if (taskId.startsWith('workflow-')) {
      toast({
        title: "Complete the setup first",
        description: "Please click the action button to complete this step."
      });
      return;
    }

    try {
      await updateTaskStatus(taskId, completed);
      
      // Invalidate and refetch tasks
      await queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] });
      
      toast({
        title: completed ? "Task completed" : "Task reopened",
        description: completed ? "Great job!" : "Task marked as pending."
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task. Please try again."
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    // Don't allow deleting workflow tasks
    if (taskId.startsWith('workflow-')) return;

    try {
      await deleteTask(taskId);
      
      // Invalidate and refetch tasks
      await queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] });
      
      toast({
        title: "Task deleted",
        description: "Task has been removed."
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again."
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50/10';
      case 'medium': return 'border-yellow-500 bg-yellow-50/10';
      case 'low': return 'border-green-500 bg-green-50/10';
      default: return 'border-gray-300 bg-white/5';
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    return `Due in ${diffDays} days`;
  };

  if (loading) {
    return (
      <Card className={cn("bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
            <div className="h-8 bg-white/20 rounded"></div>
            <div className="h-8 bg-white/20 rounded"></div>
            <div className="h-8 bg-white/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !shouldShowWorkflowTasks) {
    return (
      <Card className={cn("bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg", className)}>
        <CardContent className="p-6">
          <div className="text-center text-gray-300">
            <p className="text-red-400 mb-2">Failed to load tasks</p>
            <p className="text-sm text-gray-400 mb-4">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['dashboard-tasks'] })}
              className="text-orange-400 hover:text-orange-300"
            >
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const taskCount = shouldShowWorkflowTasks ? workflowTasks.length : remainingTasks;
  const hasAnyTasks = shouldShowWorkflowTasks || hasRealTasks;

  return (
    <Card className={cn("bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          {shouldShowWorkflowTasks ? "Get Started" : title}
          {hasAnyTasks && (
            <span className="text-sm font-normal text-gray-400">
              ({taskCount} {shouldShowWorkflowTasks ? 'steps' : 'remaining'})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add New Task - Only show for real tasks */}
        {showAddTask && !shouldShowWorkflowTasks && (
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Input
              type="text"
              placeholder="Add new task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitting}
              className="flex-1 border-0 border-b border-white/20 rounded-none bg-transparent placeholder:text-gray-500 focus-visible:ring-0 focus-visible:border-orange-500 text-sm text-white"
            />
            <Button
              onClick={handleAddTask}
              size="sm"
              disabled={!newTaskText.trim() || isSubmitting}
              className="h-8 w-8 p-0 bg-orange-600 hover:bg-orange-700 rounded-full shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Tasks from Database or Workflow */}
        <div className="space-y-2">
          {displayTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-500" />
              <p className="text-sm">No tasks yet</p>
              <p className="text-xs">Add a task above to get started</p>
            </div>
          ) : (
            <AnimatePresence>
              {displayTasks.map((task, index) => {
                const TaskIcon = 'icon' in task ? task.icon : null;
                const isWorkflowTask = task.id.startsWith('workflow-');
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                      task.completed 
                        ? "bg-white/5 border-white/10" 
                        : isWorkflowTask
                        ? getPriorityColor(task.priority)
                        : getPriorityColor(task.priority)
                    )}
                  >
                    {TaskIcon ? (
                      <TaskIcon className="h-4 w-4 text-orange-500 shrink-0" />
                    ) : (
                      <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 h-4 w-4"
                      />
                    )}
                    
                    <div className="flex-1">
                      <label
                        htmlFor={task.id}
                        className={cn(
                          "text-sm font-medium cursor-pointer transition-all duration-200 select-none",
                          task.completed 
                            ? "text-gray-500 line-through" 
                            : "text-white"
                        )}
                      >
                        {task.text}
                      </label>
                      
                      {/* Priority and Due Date */}
                      <div className="flex items-center gap-2 mt-1">
                        {task.priority === 'high' && !task.completed && (
                          <span className="text-xs text-red-400 font-medium">High Priority</span>
                        )}
                        {task.due_date && (
                          <span className="text-xs text-gray-400">
                            {formatDueDate(task.due_date)}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 capitalize">{task.category}</span>
                        {'description' in task && (
                          <span className="text-xs text-gray-500">• {task.description}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {((task.actionText && !task.completed) || ('action' in task)) && (
                        <Button
                          onClick={'action' in task ? task.action : () => navigate('/projects/tasks')}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                        >
                          {task.actionText}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                      
                      {!isWorkflowTask && (
                        <Button
                          onClick={() => handleDeleteTask(task.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Summary and View All */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300 font-medium">
              {shouldShowWorkflowTasks 
                ? "Complete these steps to get started"
                : taskCount > 0 
                ? `${taskCount} tasks remaining` 
                : hasAnyTasks 
                ? '🎉 All tasks completed!' 
                : 'No tasks yet'
              }
            </p>
            {(hasAnyTasks && !shouldShowWorkflowTasks) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/projects/tasks')}
                className="text-orange-400 hover:text-orange-300"
              >
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Motivational message */}
        <div className="pt-2">
          <p className="text-xs text-gray-500 italic leading-relaxed">
            {shouldShowWorkflowTasks 
              ? "Welcome to SISO Agency! Let's get your project started."
              : "Success is the sum of small efforts repeated day in and day out." 
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 