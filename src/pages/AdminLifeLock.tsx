import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  CheckCircle2, 
  Circle, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

interface TaskCard {
  id: string;
  date: Date;
  title: string;
  completed: boolean;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
}

const AdminLifeLock: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');

  // Sample data - in real app this would come from your backend
  const generateSampleTasks = (date: Date): TaskCard => {
    const isToday = isSameDay(date, new Date());
    const dayOfWeek = date.getDay();
    
    return {
      id: format(date, 'yyyy-MM-dd'),
      date,
      title: format(date, 'EEEE, MMM d'),
      completed: Math.random() > 0.3, // Random completion for demo
      tasks: [
        { id: '1', title: 'Morning routine', completed: Math.random() > 0.4 },
        { id: '2', title: 'Work tasks', completed: Math.random() > 0.5 },
        { id: '3', title: 'Exercise', completed: Math.random() > 0.6 },
        { id: '4', title: 'Evening review', completed: Math.random() > 0.3 },
      ].slice(0, isToday ? 4 : Math.floor(Math.random() * 4) + 1)
    };
  };

  // Get today's tasks
  const todayCard = generateSampleTasks(new Date());

  // Get week's tasks
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weekCards = weekDays.map(generateSampleTasks);

  // Get month's tasks
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const monthCards = monthDays.map(generateSampleTasks);

  const handleCardClick = (card: TaskCard) => {
    // Navigate to notion-like page for this day
    console.log('Navigate to day:', card.date);
    // TODO: Implement navigation to individual day page
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(direction === 'next' ? addMonths(selectedMonth, 1) : subMonths(selectedMonth, 1));
  };

  const TaskCardComponent = ({ card, size = 'medium' }: { card: TaskCard; size?: 'small' | 'medium' | 'large' }) => {
    const isToday = isSameDay(card.date, new Date());
    const completedTasks = card.tasks.filter(task => task.completed).length;
    const totalTasks = card.tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const cardSizes = {
      small: 'p-3 min-h-[120px]',
      medium: 'p-4 min-h-[160px]',
      large: 'p-6 min-h-[200px]'
    };

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => handleCardClick(card)}
      >
        <Card className={`
          ${cardSizes[size]}
          ${card.completed ? 'border-green-500 bg-green-50/50' : 'border-gray-200'}
          ${isToday ? 'ring-2 ring-orange-500 border-orange-500' : ''}
          hover:shadow-lg transition-all duration-200
        `}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold ${size === 'large' ? 'text-lg' : 'text-sm'}`}>
                {card.title}
              </h3>
              {card.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            {isToday && (
              <Badge variant="secondary" className="w-fit bg-orange-100 text-orange-800">
                Today
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>{completedTasks}/{totalTasks} tasks</span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="space-y-1">
                {card.tasks.slice(0, size === 'large' ? 4 : 2).map((task) => (
                  <div key={task.id} className="flex items-center space-x-2 text-xs">
                    {task.completed ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <Circle className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                      {task.title}
                    </span>
                  </div>
                ))}
                {card.tasks.length > (size === 'large' ? 4 : 2) && (
                  <div className="text-xs text-gray-500 ml-5">
                    +{card.tasks.length - (size === 'large' ? 4 : 2)} more tasks
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50 via-white to-purple-100 rounded-xl min-h-screen">
        <AdminPageTitle
          icon={Lock}
          title="Life Lock"
          subtitle="Track your daily progress with a Notion-style task overview"
        />

        {/* Today's Task Card */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-600" />
            Today's Progress
          </h2>
          <div className="max-w-md">
            <TaskCardComponent card={todayCard} size="large" />
          </div>
        </section>

        {/* Weekly View */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              This Week
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {weekCards.map((card) => (
              <TaskCardComponent key={card.id} card={card} size="medium" />
            ))}
          </div>
        </section>

        {/* Monthly View */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-purple-600" />
              Monthly Overview
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {format(selectedMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {monthCards.map((card) => (
              <TaskCardComponent key={card.id} card={card} size="small" />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex justify-center">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-6 py-3"
            onClick={() => console.log('Add new task')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminLifeLock;