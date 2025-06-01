import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Clock, ArrowRight, User, FileText, CheckCircle, Smartphone, Target, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useMainUserProject } from '@/hooks/useUserProjects';

interface RealTaskManagerProps {
  title?: string;
  className?: string;
  showAddTask?: boolean;
  maxTasks?: number;
  filterType?: 'all' | 'high-priority' | 'due-soon';
}

interface WorkflowTask {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  icon: any;
  actionText: string;
  action: () => void;
  description: string;
  batch: number; // Which batch this task belongs to (1, 2, 3, etc.)
}

// Complete workflow tasks organized in batches
const getAllWorkflowTasks = (navigate: (path: string) => void): WorkflowTask[] => [
  // Batch 1: Initial Setup (3 tasks)
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
    description: 'Set up your business profile and requirements',
    batch: 1
  },
  {
    id: 'workflow-2', 
    text: 'Define your app requirements',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'high' as const,
    category: 'planning',
    icon: Target,
    actionText: 'Define Now',
    action: () => navigate('/plan-builder'),
    description: 'Outline what your app should do and its key features',
    batch: 1
  },
  {
    id: 'workflow-3',
    text: 'Create your first project plan',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'high' as const,
    category: 'planning',
    icon: FileText,
    actionText: 'Create Plan',
    action: () => navigate('/projects/new'),
    description: 'Build a detailed project plan with timeline and costs',
    batch: 1
  },
  
  // Batch 2: Review and Approval (3 tasks)
  {
    id: 'workflow-4',
    text: 'Review the app plan',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'medium' as const,
    category: 'review',
    icon: CheckCircle,
    actionText: 'Review Plan',
    action: () => navigate('/projects'),
    description: 'Approve your app plan and requirements',
    batch: 2
  },
  {
    id: 'workflow-5',
    text: 'Configure project settings',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'medium' as const,
    category: 'setup',
    icon: Settings,
    actionText: 'Configure',
    action: () => navigate('/projects'),
    description: 'Set up development preferences and integrations',
    batch: 2
  },
  {
    id: 'workflow-6',
    text: 'Start development process',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'medium' as const,
    category: 'development',
    icon: Smartphone,
    actionText: 'Begin Dev',
    action: () => navigate('/projects'),
    description: 'Initiate the development of your MVP',
    batch: 2
  },
  
  // Batch 3: Development and Testing (3 tasks)
  {
    id: 'workflow-7',
    text: 'Review MVP progress',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'low' as const,
    category: 'development',
    icon: Smartphone,
    actionText: 'View Progress',
    action: () => navigate('/projects'),
    description: 'Review your minimum viable product development',
    batch: 3
  },
  {
    id: 'workflow-8',
    text: 'Test core features',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'low' as const,
    category: 'testing',
    icon: CheckCircle,
    actionText: 'Test Now',
    action: () => navigate('/projects'),
    description: 'Validate that key features work as expected',
    batch: 3
  },
  {
    id: 'workflow-9',
    text: 'Prepare for launch',
    completed: false,
    created_at: new Date().toISOString(),
    priority: 'low' as const,
    category: 'launch',
    icon: Target,
    actionText: 'Prepare',
    action: () => navigate('/projects'),
    description: 'Final preparations for app deployment',
    batch: 3
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
  const { project, hasProjects } = useMainUserProject();
  
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [newTaskText, setNewTaskText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all workflow tasks
  const allWorkflowTasks = getAllWorkflowTasks(navigate);
  
  // Calculate current batch based on completed tasks
  const getCurrentBatch = () => {
    const batch1Tasks = allWorkflowTasks.filter(t => t.batch === 1);
    const batch2Tasks = allWorkflowTasks.filter(t => t.batch === 2);
    
    const batch1Completed = batch1Tasks.every(t => completedTasks.has(t.id));
    const batch2Completed = batch2Tasks.every(t => completedTasks.has(t.id));
    
    if (!batch1Completed) return 1;
    if (!batch2Completed) return 2;
    return 3;
  };

  const currentBatch = getCurrentBatch();
  const currentBatchTasks = allWorkflowTasks.filter(t => t.batch === currentBatch);
  
  // Show workflow tasks if user has no projects
  const shouldShowWorkflowTasks = !hasProjects;
  const displayTasks = shouldShowWorkflowTasks 
    ? currentBatchTasks.slice(0, 3) // Always show max 3 tasks
    : []; // We'll implement database tasks later

  // Load completed tasks from localStorage on mount
  useEffect(() => {
    const savedCompleted = localStorage.getItem('workflow-completed-tasks');
    if (savedCompleted) {
      setCompletedTasks(new Set(JSON.parse(savedCompleted)));
    }
    
    // Check for actual completion states
    checkActualCompletionStates();
  }, []);

  // Refresh completion states when hasProjects changes
  useEffect(() => {
    checkActualCompletionStates();
  }, [hasProjects]);

  // Check if tasks are actually completed based on real data
  const checkActualCompletionStates = () => {
    const actuallyCompleted = new Set<string>();
    
    // Check if business onboarding is complete
    const businessData = localStorage.getItem('business-onboarding-data');
    if (businessData) {
      const data = JSON.parse(businessData);
      if (data.businessName && data.appPurpose && data.completedAt) {
        actuallyCompleted.add('workflow-1');
      }
    }
    
    // Check if plan builder has been used (example check)
    const planData = localStorage.getItem('plan-builder-data');
    if (planData) {
      actuallyCompleted.add('workflow-2');
    }
    
    // Check if project has been created
    const projectData = localStorage.getItem('user-project-data');
    if (projectData || hasProjects) {
      actuallyCompleted.add('workflow-3');
    }
    
    // Update the completed tasks state with actual completion data
    setCompletedTasks(actuallyCompleted);
    localStorage.setItem('workflow-completed-tasks', JSON.stringify([...actuallyCompleted]));
  };

  // Save completed tasks to localStorage
  const saveCompletedTasks = (completed: Set<string>) => {
    localStorage.setItem('workflow-completed-tasks', JSON.stringify([...completed]));
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    if (taskId.startsWith('workflow-')) {
      // Don't allow manual toggling of workflow tasks
      toast({
        title: "Complete the actual step",
        description: "Please click the action button to complete this task properly."
      });
      return;
    }
  };

  const handleTaskAction = (task: WorkflowTask) => {
    toast({
      title: "Starting task! 🚀",
      description: `Taking you to ${task.text.toLowerCase()}`
    });
    
    // Navigate to the task
    task.action();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50/10';
      case 'medium': return 'border-yellow-500 bg-yellow-50/10';
      case 'low': return 'border-green-500 bg-green-50/10';
      default: return 'border-gray-300 bg-white/5';
    }
  };

  const getBatchProgress = () => {
    const totalBatches = 3;
    const completedBatches = currentBatch - 1;
    const currentBatchProgress = currentBatchTasks.filter(t => completedTasks.has(t.id)).length;
    const currentBatchTotal = currentBatchTasks.length;
    
    return {
      completedBatches,
      totalBatches,
      currentBatchProgress,
      currentBatchTotal,
      currentBatch
    };
  };

  const batchProgress = getBatchProgress();
  const isCurrentBatchComplete = batchProgress.currentBatchProgress === batchProgress.currentBatchTotal;

  if (!shouldShowWorkflowTasks) {
    // For users with projects, show a simple completed state for now
    return (
      <Card className={cn("bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Onboarding Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center text-gray-300">
            <p className="text-green-400 mb-2">🎉 Welcome to SISO Agency!</p>
            <p className="text-sm text-gray-400">
              You've completed the initial setup. Your project is now active.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-black/30 backdrop-blur-sm border border-white/10 shadow-lg", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          Get Started - Batch {batchProgress.currentBatch} of {batchProgress.totalBatches}
          <span className="text-sm font-normal text-gray-400">
            ({batchProgress.currentBatchProgress}/{batchProgress.currentBatchTotal} complete)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Batch Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Batch Progress</span>
            <div className="flex items-center gap-2">
              <span>{Math.round((batchProgress.currentBatchProgress / batchProgress.currentBatchTotal) * 100)}%</span>
              <Button
                onClick={checkActualCompletionStates}
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-gray-400 hover:text-orange-400"
                title="Refresh completion status"
              >
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(batchProgress.currentBatchProgress / batchProgress.currentBatchTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-2">
          <AnimatePresence>
            {displayTasks.map((task, index) => {
              const TaskIcon = task.icon;
              const isCompleted = completedTasks.has(task.id);
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: 20 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                    isCompleted 
                      ? "bg-green-50/10 border-green-500/30" 
                      : getPriorityColor(task.priority)
                  )}
                >
                  <div className="relative">
                    <Checkbox
                      id={task.id}
                      checked={isCompleted}
                      onCheckedChange={(checked) => handleToggleTask(task.id, !!checked)}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 h-4 w-4"
                      disabled={true} // Always disabled for workflow tasks
                    />
                    {!isCompleted && (
                      <div className="absolute -top-1 -right-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse" 
                           title="Complete the actual step to check this off" />
                    )}
                  </div>
                  
                  <TaskIcon className={cn(
                    "h-4 w-4 shrink-0",
                    isCompleted ? "text-green-500" : "text-orange-500"
                  )} />
                  
                  <div className="flex-1">
                    <label
                      htmlFor={task.id}
                      className={cn(
                        "text-sm font-medium cursor-pointer transition-all duration-200 select-none",
                        isCompleted 
                          ? "text-green-400 line-through" 
                          : "text-white"
                      )}
                    >
                      {task.text}
                    </label>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {task.priority === 'high' && !isCompleted && (
                        <span className="text-xs text-red-400 font-medium">High Priority</span>
                      )}
                      <span className="text-xs text-gray-500 capitalize">{task.category}</span>
                      <span className="text-xs text-gray-500">• {task.description}</span>
                      {!isCompleted && (
                        <span className="text-xs text-orange-400">• Action required</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <Button
                        onClick={() => handleTaskAction(task)}
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                      >
                        {task.actionText}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                    {isCompleted && (
                      <div className="text-xs text-green-400 font-medium">✓ Done</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Batch Completion Message */}
        {isCurrentBatchComplete && batchProgress.currentBatch < batchProgress.totalBatches && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <p className="text-green-400 text-sm font-medium">
              🎉 Batch {batchProgress.currentBatch} Complete! 
            </p>
            <p className="text-green-300 text-xs">
              Great progress! The next batch of tasks will unlock as you continue your journey.
            </p>
          </motion.div>
        )}

        {/* Summary */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300 font-medium">
              Complete batch {batchProgress.currentBatch} to unlock next steps
            </p>
          </div>
        </div>

        {/* Motivational message */}
        <div className="pt-2">
          <p className="text-xs text-gray-500 italic leading-relaxed">
            Welcome to SISO Agency! Complete each batch at your own pace. 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 