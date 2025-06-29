import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Flag,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays, subDays } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  timeEstimate?: string;
  notes?: string;
}

const AdminLifeLockDay: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const currentDate = dateParam ? new Date(dateParam) : new Date();
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Morning routine - meditation and exercise',
      completed: true,
      priority: 'high',
      timeEstimate: '30min',
      notes: 'Completed 20 minutes of meditation and 30 minutes of cardio'
    },
    {
      id: '2',
      title: 'Review quarterly business metrics',
      completed: false,
      priority: 'high',
      timeEstimate: '2h',
      notes: ''
    },
    {
      id: '3',
      title: 'Team standup meeting',
      completed: true,
      priority: 'medium',
      timeEstimate: '30min',
      notes: 'Discussed new feature rollout timeline'
    },
    {
      id: '4',
      title: 'Client proposal draft',
      completed: false,
      priority: 'high',
      timeEstimate: '3h',
      notes: ''
    },
    {
      id: '5',
      title: 'Evening reflection and planning',
      completed: false,
      priority: 'low',
      timeEstimate: '15min',
      notes: ''
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNewTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle.trim(),
        completed: false,
        priority: 'medium'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const updateTaskTitle = (taskId: string, newTitle: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
    setEditingTaskId(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
    navigate(`/admin/life-lock/day?date=${format(newDate, 'yyyy-MM-dd')}`);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-siso-bg">
        <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6" style={{ backgroundColor: '#252525' }}>
          
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/life-lock')}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Calendar
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDay('prev')}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateDay('next')}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </motion.h1>
            
            {/* Progress Summary */}
            <div className="flex items-center space-x-4 mb-6">
              <Badge className={`px-3 py-1 ${getPriorityColor('medium')}`}>
                {completedTasks}/{totalTasks} tasks completed
              </Badge>
              <div className="flex-1 max-w-xs">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-400">{Math.round(completionRate)}%</span>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Today's Tasks
            </h2>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`group bg-gray-800/80 rounded-lg p-4 border transition-all duration-200 hover:shadow-lg ${
                    task.completed 
                      ? 'border-green-500/40 bg-green-500/5' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      {editingTaskId === task.id ? (
                        <Input
                          value={task.title}
                          onChange={(e) => updateTaskTitle(task.id, e.target.value)}
                          onBlur={() => setEditingTaskId(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingTaskId(null);
                            if (e.key === 'Escape') setEditingTaskId(null);
                          }}
                          className="bg-transparent border-none p-0 text-white focus:ring-0"
                          autoFocus
                        />
                      ) : (
                        <h3 
                          className={`text-white font-medium cursor-pointer hover:text-gray-200 ${
                            task.completed ? 'line-through opacity-70' : ''
                          }`}
                          onClick={() => setEditingTaskId(task.id)}
                        >
                          {task.title}
                        </h3>
                      )}

                      {/* Task Meta */}
                      <div className="flex items-center space-x-3 mt-2">
                        {task.priority && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(task.priority)}`}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                        )}
                        {task.timeEstimate && (
                          <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/40">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.timeEstimate}
                          </Badge>
                        )}
                      </div>

                      {/* Notes */}
                      {task.notes && (
                        <p className="text-sm text-gray-400 mt-2 italic">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add New Task */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/50 rounded-lg p-4 border border-dashed border-gray-600 hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-gray-400" />
                <Input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addNewTask();
                  }}
                  placeholder="Add a new task..."
                  className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 p-0"
                />
                {newTaskTitle.trim() && (
                  <Button
                    onClick={addNewTask}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Add
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800/80 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800/80 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{totalTasks - completedTasks}</div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
            <div className="bg-gray-800/80 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{Math.round(completionRate)}%</div>
              <div className="text-sm text-gray-400">Progress</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLifeLockDay;