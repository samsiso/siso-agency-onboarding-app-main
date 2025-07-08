import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { AITaskChat } from '@/components/admin/tasks/AITaskChat';
import { EnhancedTaskItem } from '@/components/admin/tasks/EnhancedTaskItem';
import { AdminTaskDetailModal } from '@/components/admin/tasks/AdminTaskDetailModal';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
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
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // AI Integration
  const [isAIEnabled, setIsAIEnabled] = useState(true);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks?.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
        ) || [];
        
        // Calculate progress based on completed subtasks
        const completedCount = updatedSubtasks.filter(st => st.completed).length;
        const progress = updatedSubtasks.length > 0 
          ? (completedCount / updatedSubtasks.length) * 100 
          : 0;
        
        return { ...task, subtasks: updatedSubtasks, progress };
      }
      return task;
    }));
  };

  const handleDateChange = (taskId: string, date: Date | undefined) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        dueDate: date ? date.toISOString().split('T')[0] : undefined 
      } : task
    ));
  };

  const handleToggleComplete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTask(taskId);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
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
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForModal(null);
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
      if (showDisplayDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.display-dropdown-container')) {
          setShowDisplayDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDisplayDropdown]);

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
                onTasksUpdate={setTasks}
                onChatUpdate={setChatMessages}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAIEnabled(!isAIEnabled)}
                  className={`text-xs px-3 py-1 ${
                    isAIEnabled 
                      ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {isAIEnabled ? '🤖 AI ON' : '💬 AI OFF'}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-[#252525] border-gray-600 text-white hover:bg-[#2a2a2a]"
                    onClick={() => setShowDisplayDropdown(!showDisplayDropdown)}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Display
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>

                  {showDisplayDropdown && (
                    <div className="display-dropdown-container absolute top-full mt-2 right-0 bg-[#252525] border border-gray-600 rounded-lg shadow-lg z-50 min-w-[200px]">
                      <div className="p-3">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-white mb-2">View</h4>
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                setCurrentView('list');
                                setShowDisplayDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                currentView === 'list' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                              }`}
                            >
                              <List className="h-4 w-4 inline mr-2" />
                              List View
                            </button>
                            <button
                              onClick={() => {
                                setCurrentView('kanban');
                                setShowDisplayDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                currentView === 'kanban' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                              }`}
                            >
                              <Columns3 className="h-4 w-4 inline mr-2" />
                              Kanban View
                            </button>
                            <button
                              onClick={() => {
                                setCurrentView('calendar');
                                setShowDisplayDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                currentView === 'calendar' 
                                  ? 'bg-orange-600 text-white' 
                                  : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                              }`}
                            >
                              <Calendar className="h-4 w-4 inline mr-2" />
                              Calendar View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto min-h-0" style={{ backgroundColor: '#252525' }}>
              <div className="p-4">
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
                
                {currentView === 'kanban' && (
                  <div className="text-center py-12">
                    <Grid3X3 className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">Kanban View</h3>
                    <p className="text-gray-400">Kanban functionality coming soon...</p>
                  </div>
                )}
                
                {currentView === 'calendar' && (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">Calendar View</h3>
                    <p className="text-gray-400">Calendar functionality coming soon...</p>
                  </div>
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