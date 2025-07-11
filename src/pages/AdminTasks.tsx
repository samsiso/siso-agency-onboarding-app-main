import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
// Removed framer-motion for performance optimization
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { AITaskChat } from '@/components/admin/tasks/AITaskChat';
import { EnhancedTaskItem } from '@/components/admin/tasks/EnhancedTaskItem';
import { AdminTaskDetailModal } from '@/components/admin/tasks/AdminTaskDetailModal';
import { KanbanBoard } from '@/components/admin/tasks/KanbanBoard';
import CalendarView from '@/components/admin/tasks/CalendarView';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { supabase } from '@/integrations/supabase/client';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useToast } from '@/components/ui/use-toast';
import { useTasks } from '@/hooks/useTasks';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import {
  Calendar,
  Clock,
  Filter,
  Plus,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Archive,
  ChevronDown,
  List,
  Columns3,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
  Flag,
  Users,
  BarChart3
} from 'lucide-react';

// Local types to avoid import conflicts
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: 'overdue' | 'due-today' | 'upcoming' | 'in-progress' | 'blocked' | 'not-started' | 'started' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  category: 'development' | 'design' | 'marketing' | 'client' | 'admin';
  tags?: string[];
  estimatedHours?: number;
  subtasks?: Subtask[];
  progress?: number;
  description?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

type ViewType = 'list' | 'kanban' | 'calendar';

const AdminTasks: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedTaskForDate, setSelectedTaskForDate] = useState<string | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<string | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { user } = useAuthSession();
  const { toast } = useToast();
  
  // Use React Query for task management
  const { useTaskQuery, useUpdateTask } = useTasks();
  const { useCreateTask, useDeleteTask } = useTaskOperations();
  const { data: dbTasks = [], isLoading, error, refetch: refetchTasks } = useTaskQuery(undefined, user?.id);
  const updateTaskMutation = useUpdateTask();
  const createTaskMutation = useCreateTask();
  const deleteTaskMutation = useDeleteTask();

  // Filter options organized by categories
  const filterCategories = {
    general: [
      { value: 'all', label: 'All Tasks', icon: '📋', color: 'bg-gray-600' }
    ],
    priority: [
      { value: 'high', label: 'High Priority', icon: '🔴', color: 'bg-red-500' },
      { value: 'medium', label: 'Medium Priority', icon: '🟡', color: 'bg-yellow-500' },
      { value: 'low', label: 'Low Priority', icon: '🟢', color: 'bg-green-500' }
    ],
    projects: [
      { value: 'ubahcrypt', label: 'Ubahcrypt', icon: '🔐', color: 'bg-purple-500' },
      { value: 'siso-agency', label: 'SISO Agency App', icon: '🏢', color: 'bg-blue-500' },
      { value: 'excursions', label: 'We Are Excursions', icon: '🏝️', color: 'bg-teal-500' },
      { value: 'instagram', label: 'Instagram Marketing', icon: '📱', color: 'bg-pink-500' },
      { value: 'business-ops', label: 'Business Operations', icon: '💼', color: 'bg-orange-500' }
    ]
  };

  // Priority sub-filters
  const priorityOptions = [
    { value: 'all', label: 'All Priorities', icon: '📊' },
    { value: 'high', label: 'High', icon: '🔴' },
    { value: 'medium', label: 'Medium', icon: '🟡' },
    { value: 'low', label: 'Low', icon: '🟢' }
  ];

  // Filter tasks based on selected filter and priority
  const getFilteredTasks = () => {
    let filteredTasks = tasks;
    
    // Apply main filter
    if (selectedFilter !== 'all') {
      // Priority filters
      if (['high', 'medium', 'low'].includes(selectedFilter)) {
        filteredTasks = tasks.filter(task => task.priority === selectedFilter);
      } else {
        // Project filters
        const projectFilters: { [key: string]: string[] } = {
          'ubahcrypt': ['[Ubahcrypt]'],
          'siso-agency': ['[SISO Agency App]'],
          'excursions': ['[We Are Excursions]'],
          'instagram': ['[Instagram Marketing]'],
          'business-ops': ['[Business Operations]']
        };
        
        const keywords = projectFilters[selectedFilter];
        if (keywords) {
          filteredTasks = tasks.filter(task => 
            keywords.some(keyword => task.title.includes(keyword))
          );
        }
      }
    }
    
    // Apply priority sub-filter (only when not already filtering by priority)
    if (selectedPriority !== 'all' && !['high', 'medium', 'low'].includes(selectedFilter)) {
      filteredTasks = filteredTasks.filter(task => task.priority === selectedPriority);
    }
    
    return filteredTasks;
  };

  // Convert database task to admin task format
  const convertDbTaskToAdminTask = (dbTask: any): Task => {
    const statusMap: { [key: string]: Task['status'] } = {
      'pending': 'not-started',
      'in_progress': 'in-progress',
      'completed': 'done'
    };

    const categoryMap: { [key: string]: Task['category'] } = {
      'siso_app_dev': 'development',
      'onboarding_app': 'development',
      'main': 'admin',
      'instagram': 'marketing',
      'weekly': 'admin',
      'daily': 'admin'
    };

    return {
      id: dbTask.id,
      title: dbTask.title,
      completed: dbTask.status === 'completed',
      status: statusMap[dbTask.status || 'pending'] || 'not-started',
      priority: dbTask.priority || 'medium',
      assignee: 'SISO Team',
      dueDate: dbTask.due_date,
      category: categoryMap[dbTask.category] || 'admin',
      tags: [],
      estimatedHours: Math.round((dbTask.duration || 60) / 60),
      description: dbTask.description || 'No description provided',
      subtasks: [],
      progress: 0
    };
  };

  // Handle loading and error states
  if (error) {
    console.error('Error fetching tasks:', error);
    toast({
      variant: 'destructive',
      title: 'Error loading tasks',
      description: 'Could not load tasks from database.'
    });
  }

  // Sample tasks as fallback
  const sampleTasks: Task[] = [
    {
      id: '1',
      title: 'Design landing page with portfolio showcase',
      completed: false,
      status: 'overdue',
      priority: 'high',
      assignee: 'Design Team',
      dueDate: '2025-01-15',
      category: 'design',
      tags: ['ui', 'portfolio'],
      estimatedHours: 12,
      description: 'Create a modern, responsive landing page that showcases our portfolio work with smooth animations and interactive elements. The design should be mobile-first and align with our brand guidelines.',
      subtasks: [
        { id: '1.1', title: 'Create wireframes for landing page', completed: true },
        { id: '1.2', title: 'Design hero section with animations', completed: true },
        { id: '1.3', title: 'Create portfolio grid layout', completed: false },
        { id: '1.4', title: 'Design mobile responsive views', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Create portfolio showcase section',
      completed: false,
      status: 'in-progress',
      priority: 'high',
      assignee: 'Frontend Team',
      dueDate: '2025-01-20',
      category: 'development',
      tags: ['react', 'showcase'],
      estimatedHours: 8,
      description: 'Build an interactive portfolio showcase with image galleries, filtering capabilities, and lightbox functionality. Use React components with smooth animations and ensure mobile responsiveness.',
      subtasks: [
        { id: '2.1', title: 'Set up React component structure', completed: true },
        { id: '2.2', title: 'Implement image gallery with lightbox', completed: false },
        { id: '2.3', title: 'Add filtering and sorting functionality', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Develop client specification collection system',
      completed: false,
      status: 'not-started',
      priority: 'medium',
      assignee: 'Backend Team',
      dueDate: '2025-01-25',
      category: 'development',
      tags: ['api', 'forms'],
      estimatedHours: 16,
      description: 'Create a comprehensive system for collecting and managing client specifications including forms, validation, database storage, and automated email notifications. Include proper API documentation and testing.',
      subtasks: [
        { id: '3.1', title: 'Design database schema for specifications', completed: false },
        { id: '3.2', title: 'Create REST API endpoints', completed: false },
        { id: '3.3', title: 'Implement form validation', completed: false },
        { id: '3.4', title: 'Set up email notifications', completed: false },
        { id: '3.5', title: 'Write API documentation', completed: false }
      ]
    }
  ];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  
  // Convert database tasks to admin task format - no fallback to sample tasks
  const tasks = dbTasks.length > 0 
    ? dbTasks.map(convertDbTaskToAdminTask)
    : [];
  
  // Get filtered tasks
  const filteredTasks = getFilteredTasks();
  const activeTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  // AI Integration
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  // Get current filter option for display
  const getCurrentFilterOption = () => {
    // Check all categories for the selected filter
    const allOptions = [
      ...filterCategories.general,
      ...filterCategories.priority,
      ...filterCategories.projects
    ];
    return allOptions.find(option => option.value === selectedFilter) || filterCategories.general[0];
  };

  const currentFilterOption = getCurrentFilterOption();


  const toggleTask = async (taskId: string) => {
    // Find task from the converted tasks list
    const task = getFilteredTasks().find(t => t.id === taskId);
    if (!task) {
      console.error('Task not found:', taskId);
      return;
    }

    // Determine new status based on current completed state
    const newStatus = task.completed ? 'pending' : 'completed';
    
    console.log('Toggling task:', taskId, 'from completed:', task.completed, 'to status:', newStatus);
    
    try {
      // Convert to database format for mutation
      const updateData = {
        id: taskId,
        status: newStatus as any, // Cast to satisfy TypeScript
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null
      };
      
      await updateTaskMutation.mutateAsync(updateData);

      toast({
        title: 'Task updated',
        description: `Task marked as ${newStatus === 'completed' ? 'completed' : 'pending'}.`
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Could not update task status.'
      });
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    // TODO: Implement with React Query mutation
    console.log('Toggle subtask:', taskId, subtaskId);
  };

  const handleDateChange = (taskId: string, date: Date | undefined) => {
    // TODO: Implement with React Query mutation
    console.log('Handle date change:', taskId, date);
  };

  const handleToggleComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(taskId);
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      // Map admin task status to database status
      const statusMap: { [key: string]: string } = {
        'not-started': 'pending',
        'in-progress': 'in_progress',
        'blocked': 'in_progress', // Keep as in_progress but could add blocked status to DB
        'done': 'completed',
        'started': 'in_progress',
        'upcoming': 'pending'
      };

      const dbStatus = statusMap[newStatus] || 'pending';
      
      const updateData = {
        id: taskId,
        status: dbStatus as any,
        completed_at: dbStatus === 'completed' ? new Date().toISOString() : null
      };
      
      await updateTaskMutation.mutateAsync(updateData);

      toast({
        title: 'Task updated',
        description: `Task status changed to ${newStatus.replace('-', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Could not update task status.'
      });
    }
  };

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages([...chatMessages, userMessage]);
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I understand you need help with: "' + message + '". Let me assist you with that task.',
        sender: 'assistant',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const openEditTask = (task: Task) => {
    setSelectedTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalSave = (updatedTask: Task) => {
    // TODO: Implement with React Query mutation
    console.log('Handle task modal save:', updatedTask);
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  // Calendar view handlers
  const handleEditTask = (task: Task) => {
    setSelectedTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      const newTask = {
        title: taskData.title || 'New Task',
        description: taskData.description || '',
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        category: taskData.category || 'admin',
        due_date: taskData.dueDate || null,
        assigned_to: user?.id || null
      };
      
      await createTaskMutation.mutateAsync(newTask);
      toast({
        title: "Task created",
        description: "New task has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'due-today':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'upcoming':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
      case 'blocked':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'medium':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/40';
      default:
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      if (showFilterDropdown && !target.closest('.filter-dropdown-container')) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  return (
    <AdminLayout>
      <div className="h-screen text-white overflow-hidden" style={{ backgroundColor: '#252525' }}>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - AI Task Assistant */}
          <ResizablePanel defaultSize={40} minSize={25} maxSize={60} style={{ backgroundColor: '#252525' }}>
            {isAIEnabled ? (
              <AITaskChat
                tasks={tasks}
                chatMessages={chatMessages}
                onTasksUpdate={(updatedTasks) => console.log('Tasks updated:', updatedTasks)}
                onChatUpdate={setChatMessages}
                onTaskRefresh={refetchTasks}
              />
            ) : (
              <div className="h-full flex flex-col" style={{ backgroundColor: '#252525' }}>
                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                  {chatMessages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6">
                      <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <motion.div 
                          className="w-20 h-20 mx-auto mb-8 flex items-center justify-center"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <div className="w-16 h-16 border-2 border-orange-500/30 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/10 backdrop-blur-sm shadow-lg">
                            <div className="w-8 h-8 border-l-2 border-t-2 border-orange-400 transform rotate-45"></div>
                          </div>
                        </motion.div>
                        <motion.h2 
                          className="text-2xl text-white mb-8 font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          What can I help with?
                        </motion.h2>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      <div className="space-y-6">
                        <AnimatePresence>
                          {chatMessages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`flex items-end gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar/Logo */}
                                <div className="flex-shrink-0 mb-1">
                                  {message.sender === 'user' ? (
                                    <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-orange-500/30 shadow-lg">
                                      <img 
                                        src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png" 
                                        alt="SISO" 
                                        className="w-full h-full object-cover" 
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/30 flex items-center justify-center backdrop-blur-sm shadow-lg">
                                      <div className="w-5 h-5 border-l-2 border-t-2 border-orange-400 transform rotate-45"></div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Message Bubble */}
                                <motion.div 
                                  className={`relative p-4 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl ${
                                    message.sender === 'user' 
                                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/20' 
                                      : 'bg-gray-800/80 text-gray-100 border border-gray-700/50 shadow-gray-900/20'
                                  }`}
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="text-sm leading-relaxed font-medium">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-2 font-medium">
                                    {message.timestamp.toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </p>
                                </motion.div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Chat Input */}
                <div className="p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
                  <PromptInputBox 
                    onSend={(message, files) => sendMessage(message)} 
                    placeholder="Message SISO..." 
                    className="bg-gray-800/90 border-gray-600/50 shadow-xl backdrop-blur-sm"
                  />
                </div>
              </div>
            )}
          </ResizablePanel>

          {/* Resizable Handle */}
          <ResizableHandle withHandle className="bg-gray-700 hover:bg-orange-500 transition-colors duration-200" />

          {/* Right Panel - Tasks Section */}
          <ResizablePanel defaultSize={60} minSize={40} maxSize={75}>
            <div className="h-full p-4 flex items-center justify-center" style={{ backgroundColor: '#121212' }}>
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col w-full max-w-4xl h-[calc(100vh-2rem)] mx-4">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-medium text-black">SISO Agency / today's tasks</h1>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
                  {activeTasks.length}
                </Badge>
                <div className="filter-dropdown-container relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className={`text-xs px-3 py-1 ${currentFilterOption.color} text-white border-none hover:opacity-80 shadow-lg`}
                  >
                    <span className="mr-2">{currentFilterOption.icon}</span>
                    {currentFilterOption.label}
                    <ChevronDown className="h-3 w-3 ml-2" />
                  </Button>

                  {showFilterDropdown && (
                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 min-w-[280px] overflow-hidden">
                      {/* Main Categories */}
                      <div className="p-4">
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filter Tasks
                          </h4>
                          
                          {/* General */}
                          <div className="mb-4">
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">General</h5>
                            <div className="space-y-1">
                              {filterCategories.general.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setSelectedFilter(option.value);
                                    setSelectedPriority('all');
                                    setShowFilterDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-3 ${
                                    selectedFilter === option.value
                                      ? `${option.color} text-white shadow-md`
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <span className="text-base">{option.icon}</span>
                                  <span className="font-medium">{option.label}</span>
                                  {selectedFilter === option.value && <span className="ml-auto text-xs">●</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Priority */}
                          <div className="mb-4">
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Priority</h5>
                            <div className="space-y-1">
                              {filterCategories.priority.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setSelectedFilter(option.value);
                                    setSelectedPriority('all');
                                    setShowFilterDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-3 ${
                                    selectedFilter === option.value
                                      ? `${option.color} text-white shadow-md`
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <span className="text-base">{option.icon}</span>
                                  <span className="font-medium">{option.label}</span>
                                  {selectedFilter === option.value && <span className="ml-auto text-xs">●</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          <div className="mb-4">
                            <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Projects</h5>
                            <div className="space-y-1">
                              {filterCategories.projects.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    setSelectedFilter(option.value);
                                    setSelectedPriority('all');
                                    setShowFilterDropdown(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center gap-3 ${
                                    selectedFilter === option.value
                                      ? `${option.color} text-white shadow-md`
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                                >
                                  <span className="text-base">{option.icon}</span>
                                  <span className="font-medium">{option.label}</span>
                                  {selectedFilter === option.value && <span className="ml-auto text-xs">●</span>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Priority Sub-filter (only show when in project mode) */}
                          {!['all', 'high', 'medium', 'low'].includes(selectedFilter) && (
                            <div className="border-t border-gray-100 pt-4">
                              <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Sub-filter by Priority</h5>
                              <div className="grid grid-cols-2 gap-1">
                                {priorityOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setSelectedPriority(option.value);
                                      setShowFilterDropdown(false);
                                    }}
                                    className={`px-2 py-1 text-xs rounded-md transition-all flex items-center gap-2 ${
                                      selectedPriority === option.value
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    <span>{option.icon}</span>
                                    <span>{option.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* View Icons */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('list')}
                    className={`h-8 w-8 p-0 ${
                      currentView === 'list'
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('kanban')}
                    className={`h-8 w-8 p-0 ${
                      currentView === 'kanban'
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Columns3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('calendar')}
                    className={`h-8 w-8 p-0 ${
                      currentView === 'calendar'
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ backgroundColor: '#252525' }}>
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <span className="ml-3 text-white">Loading tasks...</span>
                  </div>
                ) : (
                  <>
                    {currentView === 'list' && activeTasks.map((task, index) => (
                      <EnhancedTaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onEdit={openEditTask}
                        onSubtaskToggle={toggleSubtask}
                        onDateChange={handleDateChange}
                        showSubtasksOnHover={true}
                        isLast={index === activeTasks.length - 1}
                      />
                    ))}
                  </>
                )}
                
                {currentView === 'kanban' && (
                  <KanbanBoard
                    tasks={activeTasks}
                    onTaskToggle={toggleTask}
                    onTaskEdit={openEditTask}
                    onTaskStatusUpdate={updateTaskStatus}
                    onTaskCreate={async (taskData) => {
                      try {
                        // Map admin task format to database format
                        const dbTask = {
                          title: taskData.title || 'New Task',
                          description: taskData.description || '',
                          status: taskData.status === 'not-started' ? 'pending' : 
                                  taskData.status === 'in-progress' ? 'in_progress' : 
                                  taskData.status === 'done' ? 'completed' : 'pending',
                          priority: taskData.priority || 'medium',
                          category: taskData.category === 'development' ? 'siso_app_dev' :
                                   taskData.category === 'marketing' ? 'instagram' :
                                   taskData.category === 'design' ? 'siso_app_dev' :
                                   taskData.category === 'client' ? 'main' : 'main',
                          assigned_to: user?.id,
                          due_date: taskData.dueDate,
                          duration: (taskData.estimatedHours || 1) * 60 // Convert hours to minutes
                        };
                        
                        await createTaskMutation.mutateAsync(dbTask);
                        
                        toast({
                          title: 'Task created',
                          description: 'New task has been created successfully.'
                        });
                      } catch (error) {
                        console.error('Error creating task:', error);
                        toast({
                          variant: 'destructive',
                          title: 'Creation failed',
                          description: error instanceof Error ? error.message : 'Could not create task.'
                        });
                      }
                    }}
                    onTaskDelete={async (taskId) => {
                      try {
                        await deleteTaskMutation.mutateAsync(taskId);
                        
                        toast({
                          title: 'Task deleted',
                          description: 'Task has been deleted successfully.'
                        });
                      } catch (error) {
                        console.error('Error deleting task:', error);
                        toast({
                          variant: 'destructive',
                          title: 'Deletion failed',
                          description: error instanceof Error ? error.message : 'Could not delete task.'
                        });
                      }
                    }}
                    onTaskDuplicate={async (task) => {
                      try {
                        // Create a duplicate task
                        const duplicateTask = {
                          title: `${task.title} (Copy)`,
                          description: task.description || '',
                          status: 'pending',
                          priority: task.priority,
                          category: task.category === 'development' ? 'siso_app_dev' :
                                   task.category === 'marketing' ? 'instagram' :
                                   task.category === 'design' ? 'siso_app_dev' :
                                   task.category === 'client' ? 'main' : 'main',
                          assigned_to: user?.id,
                          due_date: task.dueDate,
                          duration: (task.estimatedHours || 1) * 60
                        };
                        
                        await createTaskMutation.mutateAsync(duplicateTask);
                        
                        toast({
                          title: 'Task duplicated',
                          description: 'Task has been duplicated successfully.'
                        });
                      } catch (error) {
                        console.error('Error duplicating task:', error);
                        toast({
                          variant: 'destructive',
                          title: 'Duplication failed',
                          description: error instanceof Error ? error.message : 'Could not duplicate task.'
                        });
                      }
                    }}
                    selectedFilter={selectedFilter}
                    selectedPriority={selectedPriority}
                    onFilterChange={setSelectedFilter}
                    onPriorityChange={setSelectedPriority}
                    filterCategories={filterCategories}
                  />
                )}
                
                {currentView === 'calendar' && (
                  <CalendarView
                    tasks={filteredTasks}
                    onTaskEdit={handleEditTask}
                    onTaskCreate={handleCreateTask}
                    onTaskDelete={handleDeleteTask}
                    selectedFilter={selectedFilter}
                    selectedPriority={selectedPriority}
                    onFilterChange={setSelectedFilter}
                    onPriorityChange={setSelectedPriority}
                    filterCategories={filterCategories}
                  />
                )}
              </div>
            </div>

            {/* Footer - Mobile Optimized */}
            <div className="flex-shrink-0 border-t border-white/20" style={{ backgroundColor: '#252525' }}>
              <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <Dialog open={showCompletedTasks} onOpenChange={setShowCompletedTasks}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200 transition-colors">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>View Completed Tasks ({completedTasks.length})</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-orange-700/50 text-white max-w-2xl" style={{ backgroundColor: '#252525' }}>
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold text-orange-400">
                        Completed Tasks
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-0 max-h-96 overflow-y-auto">
                      {completedTasks.length === 0 ? (
                        <div className="text-center py-12">
                          <CheckCircle2 className="w-16 h-16 text-orange-400 mx-auto mb-4 opacity-50" />
                          <p className="text-gray-400 text-lg">No completed tasks yet</p>
                          <p className="text-gray-500 text-sm mt-2">Complete some tasks to see them here!</p>
                        </div>
                      ) : (
                        completedTasks.map((task, index) => (
                          <div key={task.id} className="p-4 border-b border-white/20">
                            <h5 className="text-white font-medium line-through decoration-green-500/50">
                              {task.title}
                            </h5>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <div className="text-xs text-gray-400">
                  <span className="text-orange-300 font-medium">{activeTasks.length}</span> active, 
                  <span className="text-green-300 font-medium ml-1">{completedTasks.length}</span> completed
                </div>
              </div>
            </div>
          </div>
        </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Task Detail Modal */}
        <AdminTaskDetailModal
          task={selectedTaskForModal}
          isOpen={isTaskModalOpen}
          onClose={handleTaskModalClose}
          onSave={handleTaskModalSave}
          onSubtaskToggle={toggleSubtask}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminTasks;