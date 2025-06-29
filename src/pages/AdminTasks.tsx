import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedTaskItem } from '@/components/admin/tasks/EnhancedTaskItem';
import { AdminTaskDetailModal } from '@/components/admin/tasks/AdminTaskDetailModal';
import { voiceService } from '@/services/voiceService';
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
  BarChart3,
  Mic,
  MicOff
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
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

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

  // Voice command processing
  const processVoiceCommand = async (command: string) => {
    const lowercaseCmd = command.toLowerCase();
    
    // Complete all tasks
    if (lowercaseCmd.includes('complete all') || lowercaseCmd.includes('finish all')) {
      const updatedTasks = tasks.map(task => ({ ...task, completed: true }));
      setTasks(updatedTasks);
      return "All tasks completed! Great job! 🎉";
    }

    // Complete specific priority tasks
    if (lowercaseCmd.includes('complete high priority')) {
      const updatedTasks = tasks.map(task => 
        task.priority === 'high' ? { ...task, completed: true } : task
      );
      setTasks(updatedTasks);
      return "High priority tasks completed! 🔥";
    }

    // Add new task
    if (lowercaseCmd.includes('add task') || lowercaseCmd.includes('new task')) {
      const taskMatch = lowercaseCmd.match(/(?:add task|new task)\s+(.+)/);
      if (taskMatch) {
        const newTask: Task = {
          id: Date.now().toString(),
          title: taskMatch[1],
          completed: false,
          status: 'not-started',
          priority: 'medium',
          category: 'development',
          estimatedHours: 2
        };
        setTasks([...tasks, newTask]);
        return `Added new task: "${taskMatch[1]}" 📝`;
      }
    }

    // Status report
    if (lowercaseCmd.includes('status') || lowercaseCmd.includes('progress')) {
      const overdue = tasks.filter(t => t.status === 'overdue').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      return `You have ${activeTasks.length} active tasks, ${overdue} overdue, ${inProgress} in progress, and ${completedTasks.length} completed. Keep it up! 📊`;
    }

    return "I can help you complete tasks, add new tasks, or check your status. What would you like?";
  };

  // Voice input handler
  const handleVoiceInput = async () => {
    if (!voiceService.isSpeechRecognitionSupported()) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    
    try {
      await voiceService.startListening(
        async (transcript, isFinal) => {
          setVoiceTranscript(transcript);
          if (isFinal && transcript) {
            setIsListening(false);
            const response = await processVoiceCommand(transcript);
            
            // Speak the response
            if (voiceService.isTTSSupported()) {
              voiceService.speak(response);
            }
            
            // Show notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            notification.textContent = response;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
            
            setVoiceTranscript('');
          }
        },
        (error) => {
          console.error('Voice error:', error);
          setIsListening(false);
          alert('Voice recognition error: ' + error);
        },
        {
          language: 'en-US',
          continuous: false,
          interimResults: true
        }
      );
    } catch (error) {
      setIsListening(false);
      console.error('Failed to start voice input:', error);
    }
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
      <div className="min-h-screen text-white" style={{ backgroundColor: '#121212' }}>
        <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-lg sm:rounded-2xl md:rounded-3xl shadow-lg overflow-hidden">
            
            {/* Voice Transcript Display */}
            {voiceTranscript && (
              <div className="mx-4 mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                <p className="text-orange-800 text-sm">
                  <span className="font-semibold">Listening:</span> {voiceTranscript}
                </p>
              </div>
            )}
            {/* Header - Mobile Optimized */}
            <div className="bg-white px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <h1 className="text-sm sm:text-lg font-medium text-black">SISO Agency / today's tasks</h1>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
                  {activeTasks.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Voice Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`px-3 py-1.5 transition-all ${
                    isListening 
                      ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Listening...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Voice</span>
                    </>
                  )}
                </Button>
                <div className="relative ml-auto sm:ml-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-[#252525] border-gray-600 text-white hover:bg-[#2a2a2a] px-2 sm:px-3"
                    onClick={() => setShowDisplayDropdown(!showDisplayDropdown)}
                  >
                    <Grid3X3 className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Display</span>
                    <ChevronDown className="h-4 w-4 ml-1 sm:ml-2" />
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

            {/* Tasks List - Mobile Optimized */}
            <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#252525', minHeight: 'calc(100vh - 200px)' }}>
              <div className="p-3 sm:p-4">
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