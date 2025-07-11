import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  Plus,
  Sun,
  Target,
  Dumbbell,
  Heart,
  Coffee,
  Moon,
  ChevronRight,
  ChevronLeft,
  Brain,
  Mic,
  MicOff,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TodayTasksService, TodayTask } from '@/services/todayTasksService';
import { LifeLockService, DailyRoutine, DailyWorkout, DailyHealth, DailyHabits, DailyReflections } from '@/services/lifeLockService';
import { EnhancedTaskService, EnhancedTask } from '@/services/enhancedTaskService';
import { voiceService } from '@/services/voiceService';
import DailyTrackerAIAssistant from '@/components/admin/lifelock/DailyTrackerAIAssistant';
import { TaskSelector } from '@/components/admin/lifelock/TaskSelector';
import {
  DailyTrackerCard,
  DailyTrackerGrid,
  DailyTrackerSection,
  DailyTrackerProgress,
  DailyTrackerProgressSummary,
  DailyTrackerTaskItem,
  DailyTrackerTaskList,
  DailyTrackerDivider,
  DailyTrackerSectionGroup
} from '@/components/admin/lifelock/ui';

// ... (keeping all the existing interfaces and state management logic)

const AdminLifeLockDay: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const currentDate = dateParam ? parseISO(dateParam) : new Date();
  const dateKey = format(currentDate, 'yyyy-MM-dd');

  // State for all LifeLock data
  const [isLoadingLifeLockData, setIsLoadingLifeLockData] = useState(true);
  const [dailyRoutineData, setDailyRoutineData] = useState<DailyRoutine | null>(null);
  const [dailyWorkoutData, setDailyWorkoutData] = useState<DailyWorkout | null>(null);
  const [dailyHealthData, setDailyHealthData] = useState<DailyHealth | null>(null);
  const [dailyHabitsData, setDailyHabitsData] = useState<DailyHabits | null>(null);
  const [dailyReflectionsData, setDailyReflectionsData] = useState<DailyReflections | null>(null);

  // Derived state from LifeLock data
  const morningRoutine = dailyRoutineData?.items || [];
  const setMorningRoutine = (items: any[]) => {
    if (dailyRoutineData) {
      const updatedRoutine = { ...dailyRoutineData, items };
      setDailyRoutineData(updatedRoutine);
      LifeLockService.updateDailyRoutine(updatedRoutine);
    }
  };

  // Deep Focus Work Tasks - Load from Enhanced Task Service
  const [deepFocusTasks, setDeepFocusTasks] = useState<EnhancedTask[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // Load enhanced tasks from Supabase on mount and date change
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const tasks = await EnhancedTaskService.getDeepFocusTasksForDate(currentDate);
        setDeepFocusTasks(tasks);
      } catch (error) {
        console.error('Failed to load enhanced tasks:', error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    loadTasks();
  }, [currentDate]);

  // Update task completion with enhanced analytics
  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      const task = deepFocusTasks.find(t => t.id === taskId);
      const analytics = task ? {
        planned_duration: task.estimated_duration,
        actual_duration: task.actual_duration,
        focus_quality: 8, // Could be input from user
        energy_level_start: 7,
        energy_level_end: 6,
        distractions_count: 0
      } : undefined;

      const success = await EnhancedTaskService.updateTaskCompletion(taskId, completed, analytics);
      if (success) {
        setDeepFocusTasks(prev => 
          prev.map(task => 
            task.id === taskId ? { ...task, status: completed ? 'done' : 'pending' } : task
          )
        );
        
        // Sync with LifeLock after task completion
        await EnhancedTaskService.syncTasksToLifeLock(currentDate);
      }
    } catch (error) {
      console.error('Failed to update enhanced task:', error);
    }
  };

  // Light Focus Work Tasks - Keep as editable local tasks (stored in habits_data)
  const lightFocusTasks = dailyHabitsData?.habits_data?.lightFocusTasks || [
    { id: '1', title: '', completed: false },
    { id: '2', title: '', completed: false },
    { id: '3', title: '', completed: false },
    { id: '4', title: '', completed: false },
    { id: '5', title: '', completed: false }
  ];
  const setLightFocusTasks = (tasks: any[]) => {
    if (dailyHabitsData) {
      const updatedHabits = { 
        ...dailyHabitsData, 
        habits_data: { ...dailyHabitsData.habits_data, lightFocusTasks: tasks }
      };
      setDailyHabitsData(updatedHabits);
      LifeLockService.updateDailyHabits(updatedHabits);
    }
  };

  // Import tasks handler for deep focus tasks
  const handleImportDeepFocusTasks = async (importedTasks: EnhancedTask[]) => {
    try {
      // Add imported tasks to the current deep focus tasks
      const newTasks = [...deepFocusTasks, ...importedTasks];
      setDeepFocusTasks(newTasks);
      
      // Update the tasks in the database with today's date
      for (const task of importedTasks) {
        await EnhancedTaskService.updateTask(task.id, { due_date: format(currentDate, 'yyyy-MM-dd') });
      }
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `✅ ${importedTasks.length} deep focus task${importedTasks.length !== 1 ? 's' : ''} imported successfully!`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Failed to import deep focus tasks:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '❌ Failed to import tasks';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  // Import tasks handler for light focus tasks
  const handleImportLightFocusTasks = async (importedTasks: EnhancedTask[]) => {
    try {
      // Convert imported tasks to light focus format and add to existing tasks
      const lightTasksToAdd = importedTasks.map(task => ({
        id: task.id,
        title: task.title,
        completed: false,
        description: task.description
      }));
      
      // Find empty slots in light focus tasks and fill them
      const updatedLightTasks = [...lightFocusTasks];
      let addedCount = 0;
      
      lightTasksToAdd.forEach(newTask => {
        const emptySlotIndex = updatedLightTasks.findIndex(slot => !slot.title && addedCount < 5);
        if (emptySlotIndex !== -1) {
          updatedLightTasks[emptySlotIndex] = newTask;
          addedCount++;
        }
      });
      
      // If we still have tasks to add and no empty slots, add them to the end
      if (addedCount < lightTasksToAdd.length) {
        const remainingTasks = lightTasksToAdd.slice(addedCount);
        updatedLightTasks.push(...remainingTasks);
      }
      
      setLightFocusTasks(updatedLightTasks);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `✅ ${importedTasks.length} light focus task${importedTasks.length !== 1 ? 's' : ''} imported successfully!`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Failed to import light focus tasks:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = '❌ Failed to import tasks';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }
  };

  // Workout Data from Supabase
  const workoutItems = dailyWorkoutData?.exercises || [];
  const setWorkoutItems = (exercises: any[]) => {
    if (dailyWorkoutData) {
      const updatedWorkout = { ...dailyWorkoutData, exercises };
      setDailyWorkoutData(updatedWorkout);
      LifeLockService.updateDailyWorkout(updatedWorkout);
    }
  };

  // Health Non-Negotiables from Supabase
  const healthItems = dailyHealthData?.health_checklist || [];
  const setHealthItems = (items: any[]) => {
    if (dailyHealthData) {
      const updatedHealth = { ...dailyHealthData, health_checklist: items };
      setDailyHealthData(updatedHealth);
      LifeLockService.updateDailyHealth(updatedHealth);
    }
  };

  // Meal tracking from Supabase
  const meals = dailyHealthData?.meals || { breakfast: '', lunch: '', dinner: '', snacks: '' };
  const setMeals = (newMeals: any) => {
    if (dailyHealthData) {
      const updatedHealth = { ...dailyHealthData, meals: newMeals };
      setDailyHealthData(updatedHealth);
      LifeLockService.updateDailyHealth(updatedHealth);
    }
  };

  const dailyTotals = dailyHealthData?.macros || { calories: '', protein: '', carbs: '', fats: '' };
  const setDailyTotals = (newTotals: any) => {
    if (dailyHealthData) {
      const updatedHealth = { ...dailyHealthData, macros: newTotals };
      setDailyHealthData(updatedHealth);
      LifeLockService.updateDailyHealth(updatedHealth);
    }
  };

  // Screen time and habits from Supabase
  const habits = {
    bullshitContentTime: dailyHabitsData?.bullshit_content_minutes?.toString() || '',
    noWeed: dailyHabitsData?.no_weed || false,
    noScrolling: dailyHabitsData?.no_scrolling || false
  };
  const setHabits = (newHabits: any) => {
    if (dailyHabitsData) {
      const updatedHabits = { 
        ...dailyHabitsData, 
        bullshit_content_minutes: parseInt(newHabits.bullshitContentTime) || 0,
        no_weed: newHabits.noWeed,
        no_scrolling: newHabits.noScrolling
      };
      setDailyHabitsData(updatedHabits);
      LifeLockService.updateDailyHabits(updatedHabits);
    }
  };

  // Nightly checkout from Supabase
  const nightlyCheckout = {
    wentWell: dailyReflectionsData?.went_well || ['', '', ''],
    evenBetterIf: dailyReflectionsData?.even_better_if || ['', '', '', '', ''],
    analysis: dailyReflectionsData?.analysis || ['', '', ''],
    patterns: dailyReflectionsData?.patterns || ['', '', ''],
    changes: dailyReflectionsData?.changes || ['', '', '']
  };
  const setNightlyCheckout = (newCheckout: any) => {
    if (dailyReflectionsData) {
      const updatedReflections = { 
        ...dailyReflectionsData, 
        went_well: newCheckout.wentWell,
        even_better_if: newCheckout.evenBetterIf,
        analysis: newCheckout.analysis,
        patterns: newCheckout.patterns,
        changes: newCheckout.changes
      };
      setDailyReflectionsData(updatedReflections);
      LifeLockService.updateDailyReflections(updatedReflections);
    }
  };

  // Work hours from habits data
  const workHours = {
    deepFocus: dailyHabitsData?.deep_work_hours?.toString() || '',
    lightFocus: dailyHabitsData?.light_work_hours?.toString() || ''
  };
  const setWorkHours = (newHours: any) => {
    if (dailyHabitsData) {
      const updatedHabits = { 
        ...dailyHabitsData, 
        deep_work_hours: parseFloat(newHours.deepFocus) || 0,
        light_work_hours: parseFloat(newHours.lightFocus) || 0
      };
      setDailyHabitsData(updatedHabits);
      LifeLockService.updateDailyHabits(updatedHabits);
    }
  };

  // Macros are now handled by dailyTotals above

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  // Show loading state if data is still loading
  if (isLoadingLifeLockData) {
    return (
      <AdminLayout>
        <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
          <div className="text-white text-lg">Loading your LifeLock data...</div>
        </div>
      </AdminLayout>
    );
  }

  // Load all LifeLock data from Supabase on mount and date change
  useEffect(() => {
    const loadLifeLockData = async () => {
      setIsLoadingLifeLockData(true);
      try {
        // Try to migrate localStorage data first (only if Supabase data doesn't exist)
        const existingData = await LifeLockService.getAllDailyData(currentDate);
        
        // If no data exists in Supabase, try to migrate from localStorage
        if (!existingData.routine && !existingData.workout && !existingData.health) {
          console.log('No Supabase data found, attempting localStorage migration...');
          await LifeLockService.migrateLocalStorageData(currentDate);
        }
        
        // Load fresh data from Supabase after potential migration
        const data = await LifeLockService.getAllDailyData(currentDate);
        
        setDailyRoutineData(data.routine);
        setDailyWorkoutData(data.workout);
        setDailyHealthData(data.health);
        setDailyHabitsData(data.habits);
        setDailyReflectionsData(data.reflections);
        
      } catch (error) {
        console.error('Failed to load LifeLock data:', error);
      } finally {
        setIsLoadingLifeLockData(false);
      }
    };

    loadLifeLockData();
  }, [currentDate]);

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
    navigate(`/admin/life-lock/day?date=${format(newDate, 'yyyy-MM-dd')}`);
  };

  const toggleItem = (items: any[], setItems: Function, id: string) => {
    const updatedItems = items.map((item: any) => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setItems(updatedItems);
  };

  const updateItemField = (items: any[], setItems: Function, id: string, field: string, value: string) => {
    const updatedItems = items.map((item: any) => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
  };

  // Voice command processing
  const processVoiceCommand = async (command: string) => {
    const lowercaseCmd = command.toLowerCase();
    
    // Morning routine commands
    if (lowercaseCmd.includes('morning routine') || lowercaseCmd.includes('morning')) {
      if (lowercaseCmd.includes('complete') || lowercaseCmd.includes('check') || lowercaseCmd.includes('done')) {
        const allCompleted = morningRoutine.map(item => ({ ...item, completed: true }));
        setMorningRoutine(allCompleted);
        return "Morning routine completed! 🌅";
      }
    }

    // Deep focus task commands
    if (lowercaseCmd.includes('deep focus') || lowercaseCmd.includes('focus task')) {
      if (lowercaseCmd.includes('delete all') || lowercaseCmd.includes('clear all')) {
        // Clear deep focus tasks would need special handling with Supabase
        return "Deep focus tasks cleared! 🧠";
      }
      if (lowercaseCmd.includes('complete')) {
        for (const task of deepFocusTasks) {
          if (!task.completed) {
            await handleTaskToggle(task.id, true);
          }
        }
        return "Deep focus tasks completed! 🎯";
      }
    }

    // Workout commands
    if (lowercaseCmd.includes('workout') || lowercaseCmd.includes('exercise')) {
      if (lowercaseCmd.includes('complete') || lowercaseCmd.includes('done')) {
        const allCompleted = workoutItems.map(item => ({ ...item, completed: true }));
        setWorkoutItems(allCompleted);
        return "Workout completed! 💪";
      }
    }

    // Health commands
    if (lowercaseCmd.includes('health') || lowercaseCmd.includes('supplement')) {
      if (lowercaseCmd.includes('complete') || lowercaseCmd.includes('done')) {
        const allCompleted = healthItems.map(item => ({ ...item, completed: true }));
        setHealthItems(allCompleted);
        return "Health items completed! 🌱";
      }
    }

    // Work hours
    const hourMatch = lowercaseCmd.match(/(\d+)\s*hours?/);
    if (hourMatch && lowercaseCmd.includes('log')) {
      const hours = hourMatch[1];
      if (lowercaseCmd.includes('deep')) {
        setWorkHours({ ...workHours, deepFocus: hours });
        return `Logged ${hours} hours of deep focus! 🧠`;
      }
    }

    return "I can help you complete morning routine, tasks, workout, or log hours. What would you like?";
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
            
            // Show visual notification instead of voice response
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

  // AI Assistant task update handler
  const handleAITasksUpdate = (category: string, action: string, tasks?: any[]) => {
    try {
      switch (action) {
        case 'clear':
          if (category === 'all' || category === 'deepFocus') {
            setDeepFocusTasks([]);
          }
          if (category === 'all' || category === 'lightFocus') {
            setLightFocusTasks(prev => prev.map(task => ({ ...task, completed: false, title: '' })));
          }
          if (category === 'all' || category === 'morningRoutine') {
            setMorningRoutine(prev => prev.map(item => ({ ...item, completed: false })));
          }
          if (category === 'all' || category === 'workout') {
            setWorkoutItems(prev => prev.map(item => ({ ...item, completed: false, logged: '' })));
          }
          if (category === 'all' || category === 'health') {
            setHealthItems(prev => prev.map(item => ({ ...item, completed: false })));
          }
          break;

        case 'complete_all':
          if (category === 'all' || category === 'deepFocus') {
            deepFocusTasks.forEach(task => {
              if (!task.completed) {
                handleTaskToggle(task.id, true);
              }
            });
          }
          if (category === 'all' || category === 'lightFocus') {
            setLightFocusTasks(prev => prev.map(task => ({ ...task, completed: true })));
          }
          if (category === 'all' || category === 'morningRoutine') {
            setMorningRoutine(prev => prev.map(item => ({ ...item, completed: true })));
          }
          if (category === 'all' || category === 'workout') {
            setWorkoutItems(prev => prev.map(item => ({ ...item, completed: true })));
          }
          if (category === 'all' || category === 'health') {
            setHealthItems(prev => prev.map(item => ({ ...item, completed: true })));
          }
          break;

        case 'add':
          if (tasks && category === 'deepFocus') {
            // Add tasks to light focus as editable items since deep focus is from Supabase
            const newLightTasks = tasks.map(task => ({
              id: task.id,
              title: task.title,
              completed: false,
              notes: task.notes
            }));
            setLightFocusTasks(prev => {
              const updated = [...prev];
              newLightTasks.forEach((newTask, index) => {
                if (index < updated.length && !updated[index].title) {
                  updated[index] = newTask;
                }
              });
              return updated;
            });
          }
          break;

        default:
          console.log(`Unknown action: ${action}`);
      }

      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `✅ AI Command executed successfully!`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);

    } catch (error) {
      console.error('AI task update error:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `❌ Failed to execute AI command`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  // Calculate progress for each section
  const morningRoutineProgress = (morningRoutine.filter(item => item.completed).length / morningRoutine.length) * 100;
  const deepFocusProgress = deepFocusTasks.length > 0 
    ? (deepFocusTasks.filter(task => task.status === 'done').length / deepFocusTasks.length) * 100 
    : 0;
  const lightFocusProgress = (lightFocusTasks.filter(task => task.completed && task.title).length / lightFocusTasks.filter(task => task.title).length) * 100 || 0;
  const workoutProgress = (workoutItems.filter(item => item.completed).length / workoutItems.length) * 100;
  const healthProgress = (healthItems.filter(item => item.completed).length / healthItems.length) * 100;

  const progressSections = [
    { id: 'morning', label: 'Morning Routine', completed: morningRoutine.filter(i => i.completed).length, total: morningRoutine.length, color: 'warning' as const },
    { id: 'deepFocus', label: 'Deep Focus', completed: deepFocusTasks.filter(t => t.status === 'done').length, total: deepFocusTasks.length, color: 'default' as const },
    { id: 'lightFocus', label: 'Light Focus', completed: lightFocusTasks.filter(t => t.completed && t.title).length, total: lightFocusTasks.filter(t => t.title).length, color: 'success' as const },
    { id: 'workout', label: 'Workout', completed: workoutItems.filter(i => i.completed).length, total: workoutItems.length, color: 'danger' as const },
    { id: 'health', label: 'Health', completed: healthItems.filter(i => i.completed).length, total: healthItems.length, color: 'default' as const }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-gray-900">
        <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
          
          {/* Header Section */}
          <DailyTrackerSection noPadding>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/admin/life-lock')}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 text-xs sm:text-sm px-1.5 sm:px-3"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Calendar</span>
                  <span className="sm:hidden">Back</span>
                </Button>
                
                <div className="flex items-center gap-0.5 sm:gap-1 ml-auto sm:ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateDay('prev')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-1.5 sm:px-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateDay('next')}
                    className="text-gray-300 hover:text-white hover:bg-gray-700 px-1.5 sm:px-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Voice Button - Always visible on mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceInput}
                  className={`ml-1 sm:ml-2 px-2 sm:px-3 py-1 sm:py-1.5 transition-all ${
                    isListening 
                      ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 animate-pulse' 
                      : 'bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700'
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
              </div>
            </div>
          </DailyTrackerSection>

          {/* Voice Transcript Display */}
          {voiceTranscript && (
            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-200 text-sm">
                <span className="font-semibold">Listening:</span> {voiceTranscript}
              </p>
            </div>
          )}

          {/* Page Title and Progress Summary */}
          <DailyTrackerSection className="mb-4 sm:mb-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <motion.h1 
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="hidden sm:inline">{format(currentDate, 'EEEE, MMMM d, yyyy')}</span>
                <span className="sm:hidden">{format(currentDate, 'EEE, MMM d')}</span>
              </motion.h1>
              
              {/* Progress summary - hidden on mobile, shown as horizontal scroll on tablet+ */}
              <div className="hidden sm:block">
                <DailyTrackerProgressSummary sections={progressSections} />
              </div>
            </div>
          </DailyTrackerSection>

          {/* Main Content Grid */}
          <DailyTrackerGrid
            columns={{ mobile: 1, tablet: 2, desktop: 3 }}
            gap="sm"
            items={[
              {
                id: 'morning-routine',
                priority: 1,
                span: 'full',
                content: (
                  <DailyTrackerCard
                    title="Morning Routine"
                    icon={Sun}
                    emoji="🌅"
                    color="yellow"
                    progress={morningRoutineProgress}
                    headerContent={
                      <>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <h3 className="font-bold text-yellow-300 mb-1.5 sm:mb-2 text-sm sm:text-base">Coding My Brain</h3>
                            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                              I am Shaan Sisodia. I have been given divine purpose, and on this mission, temptation awaits on either side of the path. 
                              When I give in to temptation, I shall know I am astray. I will bring my family to a new age of freedom. 
                              I will not be distracted from the path.
                            </p>
                          </div>
                          <DailyTrackerDivider color="yellow" />
                          <div>
                            <h3 className="font-bold text-yellow-300 mb-1.5 sm:mb-2 text-sm sm:text-base">Flow State Rules</h3>
                            <ul className="text-gray-200 text-xs sm:text-sm space-y-0.5 sm:space-y-1">
                              <li>• No use of apps other than Notion.</li>
                              <li>• No vapes or drugs (including weed).</li>
                              <li>• No more than 5 seconds until the next action.</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    }
                  >
                    <DailyTrackerTaskList
                      tasks={morningRoutine.map(item => ({
                        id: item.id,
                        title: item.title,
                        completed: item.completed,
                        description: item.description,
                        logField: item.logField
                      }))}
                      onToggle={(id) => toggleItem(morningRoutine, setMorningRoutine, id)}
                      onUpdate={(id, field, value) => updateItemField(morningRoutine, setMorningRoutine, id, field, value)}
                      color="yellow"
                      variant="default"
                    />
                  </DailyTrackerCard>
                )
              },
              {
                id: 'deep-focus',
                priority: 2,
                content: (
                  <DailyTrackerCard
                    title="Deep Focus Work Session"
                    description="Tasks that require the most focus to create the most value. (8 hr minimum)"
                    icon={Brain}
                    emoji="🌅"
                    color="orange"
                    progress={deepFocusProgress}
                    headerContent={
                      <div className="space-y-3">
                        <div>
                          <label className="text-white font-medium text-xs sm:text-sm block mb-1">Total Work Hours Logged:</label>
                          <Input
                            value={workHours.deepFocus}
                            onChange={(e) => setWorkHours(prev => ({ ...prev, deepFocus: e.target.value }))}
                            className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                            placeholder="Enter hours..."
                          />
                        </div>
                        <DailyTrackerDivider />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Main Tasks:</h3>
                          <TaskSelector
                            workType="deep_focus"
                            onTasksImport={handleImportDeepFocusTasks}
                            currentDate={currentDate}
                            existingTaskIds={deepFocusTasks.map(t => t.id)}
                          />
                        </div>
                      </div>
                    }
                  >
                    {isLoadingTasks ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-gray-400">Loading today's tasks...</div>
                      </div>
                    ) : (
                      <DailyTrackerTaskList
                        tasks={deepFocusTasks.map(task => ({
                          id: task.id,
                          title: task.title,
                          completed: task.status === 'done',
                          priority: task.priority,
                          category: task.category,
                          description: task.description,
                          dueDate: task.due_date,
                          workType: task.work_type,
                          focusLevel: task.focus_level,
                          estimatedDuration: task.estimated_duration,
                          effortPoints: task.effort_points
                        }))}
                        onToggle={(id) => handleTaskToggle(id, deepFocusTasks.find(t => t.id === id)?.status !== 'done')}
                        color="orange"
                        variant="default"
                        emptyMessage="No tasks found for today. Tasks will appear here when created in the task management system."
                      />
                    )}
                  </DailyTrackerCard>
                )
              },
              {
                id: 'light-focus',
                priority: 3,
                content: (
                  <DailyTrackerCard
                    title="Light Focus Work Session"
                    description="Tackle tasks that don't require as much cognitive load."
                    icon={Coffee}
                    emoji="🌅"
                    color="green"
                    progress={lightFocusProgress}
                    headerContent={
                      <div className="space-y-3">
                        <div>
                          <label className="text-white font-medium text-xs sm:text-sm block mb-1">Total Work Hours Logged:</label>
                          <Input
                            value={workHours.lightFocus}
                            onChange={(e) => setWorkHours(prev => ({ ...prev, lightFocus: e.target.value }))}
                            className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                            placeholder="Enter hours..."
                          />
                        </div>
                        <DailyTrackerDivider />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base">Main Tasks:</h3>
                          <TaskSelector
                            workType="light_focus"
                            onTasksImport={handleImportLightFocusTasks}
                            currentDate={currentDate}
                            existingTaskIds={lightFocusTasks.map(t => t.id).filter(id => typeof id === 'string')}
                          />
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-2 sm:space-y-3">
                      {lightFocusTasks.map((task) => (
                        <div key={task.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-900/10 border border-green-700/30 rounded-lg hover:bg-green-900/15 transition-colors">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleItem(lightFocusTasks, setLightFocusTasks, task.id)}
                            className="mt-0.5 sm:mt-1 border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 h-4 w-4 sm:h-5 sm:w-5"
                          />
                          <div className="flex-1">
                            <Input
                              value={task.title}
                              onChange={(e) => updateItemField(lightFocusTasks, setLightFocusTasks, task.id, 'title', e.target.value)}
                              className="bg-transparent border-none text-white p-0 focus:ring-0 text-xs sm:text-sm h-6 sm:h-8"
                              placeholder="Enter task..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </DailyTrackerCard>
                )
              },
              {
                id: 'workout',
                priority: 4,
                content: (
                  <DailyTrackerCard
                    title="Home Workout Objective"
                    icon={Dumbbell}
                    emoji="🌅 🏋️‍♂️"
                    color="red"
                    progress={workoutProgress}
                  >
                    <DailyTrackerTaskList
                      tasks={workoutItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        completed: item.completed,
                        description: item.target,
                        logField: 'Log your result...',
                        logValue: item.logged
                      }))}
                      onToggle={(id) => toggleItem(workoutItems, setWorkoutItems, id)}
                      onUpdate={(id, field, value) => updateItemField(workoutItems, setWorkoutItems, id, field === 'logValue' ? 'logged' : field, value)}
                      color="red"
                      variant="default"
                    />
                  </DailyTrackerCard>
                )
              },
              {
                id: 'health',
                priority: 5,
                span: 'two-thirds',
                content: (
                  <DailyTrackerCard
                    title="Health Non Negotiables"
                    icon={Heart}
                    emoji="🌅"
                    color="pink"
                    progress={healthProgress}
                  >
                    <DailyTrackerTaskList
                      tasks={healthItems.map(item => ({
                        id: item.id,
                        title: item.title,
                        completed: item.completed
                      }))}
                      onToggle={(id) => toggleItem(healthItems, setHealthItems, id)}
                      color="pink"
                      variant="compact"
                    />

                    <DailyTrackerDivider className="my-4 sm:my-6" />
                    
                    {/* Daily Calorie & Macro Tracker */}
                    <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Daily Calorie & Macro Tracker</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Breakfast:</label>
                        <Textarea
                          value={meals.breakfast}
                          onChange={(e) => setMeals(prev => ({ ...prev, breakfast: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                          placeholder="Enter breakfast details..."
                        />
                      </div>
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Lunch:</label>
                        <Textarea
                          value={meals.lunch}
                          onChange={(e) => setMeals(prev => ({ ...prev, lunch: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                          placeholder="Enter lunch details..."
                        />
                      </div>
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Dinner:</label>
                        <Textarea
                          value={meals.dinner}
                          onChange={(e) => setMeals(prev => ({ ...prev, dinner: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                          placeholder="Enter dinner details..."
                        />
                      </div>
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Snacks:</label>
                        <Textarea
                          value={meals.snacks}
                          onChange={(e) => setMeals(prev => ({ ...prev, snacks: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                          placeholder="Enter snack details..."
                        />
                      </div>
                    </div>

                    <DailyTrackerDivider />
                    
                    <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">Daily Totals:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Total Calories:</label>
                        <Input
                          value={dailyTotals.calories}
                          onChange={(e) => setDailyTotals(prev => ({ ...prev, calories: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Total Protein:</label>
                        <Input
                          value={dailyTotals.protein}
                          onChange={(e) => setDailyTotals(prev => ({ ...prev, protein: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                          placeholder="0g"
                        />
                      </div>
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Total Carbs:</label>
                        <Input
                          value={dailyTotals.carbs}
                          onChange={(e) => setDailyTotals(prev => ({ ...prev, carbs: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                          placeholder="0g"
                        />
                      </div>
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium">Total Fats:</label>
                        <Input
                          value={dailyTotals.fats}
                          onChange={(e) => setDailyTotals(prev => ({ ...prev, fats: e.target.value }))}
                          className="mt-1 bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                          placeholder="0g"
                        />
                      </div>
                    </div>
                  </DailyTrackerCard>
                )
              },
              {
                id: 'screen-time',
                priority: 6,
                content: (
                  <DailyTrackerCard
                    title="Screen Time Limits"
                    description="(No scrolling outside 1 hr bullshit content.)"
                    icon={Smartphone}
                    emoji="💡 📱"
                    color="yellow"
                    isCompact
                  >
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="text-white text-xs sm:text-sm font-medium block mb-1">Bullshit Content (1 hr max):</label>
                        <Input
                          value={habits.bullshitContentTime}
                          onChange={(e) => setHabits(prev => ({ ...prev, bullshitContentTime: e.target.value }))}
                          className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                          placeholder="____ min"
                        />
                      </div>
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          checked={habits.noWeed}
                          onCheckedChange={(checked) => setHabits(prev => ({ ...prev, noWeed: !!checked }))}
                          className="mt-0.5"
                        />
                        <span className="text-white text-xs sm:text-sm leading-tight">No Weed, No Vapes: Adhered to?</span>
                      </div>
                      <div className="flex items-start space-x-2 sm:space-x-3">
                        <Checkbox
                          checked={habits.noScrolling}
                          onCheckedChange={(checked) => setHabits(prev => ({ ...prev, noScrolling: !!checked }))}
                          className="mt-0.5"
                        />
                        <span className="text-white text-xs sm:text-sm leading-tight">No Scrolling: Adhered to?</span>
                      </div>
                    </div>
                  </DailyTrackerCard>
                )
              },
              {
                id: 'nightly-checkout',
                priority: 7,
                span: 'full',
                content: (
                  <DailyTrackerCard
                    title="Nightly Check-Out"
                    icon={Moon}
                    emoji="🌅"
                    color="indigo"
                  >
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">1. What went well today?</h4>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">(Write down at least three positive things that happened during the day)</p>
                        <div className="space-y-2">
                          {nightlyCheckout.wentWell.map((item, index) => (
                            <Input
                              key={index}
                              value={item}
                              onChange={(e) => {
                                const newArray = [...nightlyCheckout.wentWell];
                                newArray[index] = e.target.value;
                                setNightlyCheckout(prev => ({ ...prev, wentWell: newArray }));
                              }}
                              className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                              placeholder={`Positive thing ${index + 1}...`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">2. Even better if...</h4>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3">(List areas where you could improve or things that could have gone better)</p>
                        <div className="space-y-2">
                          {nightlyCheckout.evenBetterIf.map((item, index) => (
                            <Input
                              key={index}
                              value={item}
                              onChange={(e) => {
                                const newArray = [...nightlyCheckout.evenBetterIf];
                                newArray[index] = e.target.value;
                                setNightlyCheckout(prev => ({ ...prev, evenBetterIf: newArray }));
                              }}
                              className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm h-8 sm:h-10"
                              placeholder={`Improvement area ${index + 1}...`}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">3. Analysis & Improvement:</h4>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">(Reflect on how you can improve in the areas mentioned in "Even better if...")</p>
                            <div className="space-y-2">
                              {nightlyCheckout.analysis.map((item, index) => (
                                <Textarea
                                  key={index}
                                  value={item}
                                  onChange={(e) => {
                                    const newArray = [...nightlyCheckout.analysis];
                                    newArray[index] = e.target.value;
                                    setNightlyCheckout(prev => ({ ...prev, analysis: newArray }));
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                                  placeholder={`Analysis point ${index + 1}...`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">(Identify any patterns or behaviors that may be preventing you from achieving your goals)</p>
                            <div className="space-y-2">
                              {nightlyCheckout.patterns.map((item, index) => (
                                <Textarea
                                  key={index}
                                  value={item}
                                  onChange={(e) => {
                                    const newArray = [...nightlyCheckout.patterns];
                                    newArray[index] = e.target.value;
                                    setNightlyCheckout(prev => ({ ...prev, patterns: newArray }));
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                                  placeholder={`Pattern ${index + 1}...`}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-400 text-xs sm:text-sm mb-2">(Consider any changes you can make in your habits or environment to support improvement)</p>
                            <div className="space-y-2">
                              {nightlyCheckout.changes.map((item, index) => (
                                <Textarea
                                  key={index}
                                  value={item}
                                  onChange={(e) => {
                                    const newArray = [...nightlyCheckout.changes];
                                    newArray[index] = e.target.value;
                                    setNightlyCheckout(prev => ({ ...prev, changes: newArray }));
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
                                  placeholder={`Change ${index + 1}...`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DailyTrackerCard>
                )
              }
            ]}
          />
          
        </div>
      </div>
      
      {/* AI Assistant */}
      <DailyTrackerAIAssistant
        currentTasks={{
          deepFocus: deepFocusTasks.map(task => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            priority: task.priority,
            category: 'deep_focus',
            notes: task.description
          })),
          lightFocus: lightFocusTasks,
          morningRoutine: morningRoutine,
          workout: workoutItems,
          health: healthItems
        }}
        onTasksUpdate={handleAITasksUpdate}
      />
    </AdminLayout>
  );
};

export default AdminLifeLockDay;