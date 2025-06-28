import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, addMonths, subMonths, getYear, eachWeekOfInterval, getWeek } from 'date-fns';

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
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [view, setView] = useState<'week' | 'month'>('week');

  // Generate available years (current year ± 2)
  const currentYear = getYear(new Date());
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
  // Generate months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Sample data - in real app this would come from your backend
  const generateSampleTasks = (date: Date): TaskCard => {
    const isToday = isSameDay(date, new Date());
    const isPast = date < new Date() && !isToday;
    const dayOfWeek = date.getDay();
    
    return {
      id: format(date, 'yyyy-MM-dd'),
      date,
      title: format(date, 'EEEE, MMM d'),
      completed: isPast ? Math.random() > 0.2 : Math.random() > 0.3, // Past days more likely completed
      tasks: [
        { id: '1', title: 'Morning routine', completed: isPast ? Math.random() > 0.2 : Math.random() > 0.4 },
        { id: '2', title: 'Work tasks', completed: isPast ? Math.random() > 0.3 : Math.random() > 0.5 },
        { id: '3', title: 'Exercise', completed: isPast ? Math.random() > 0.4 : Math.random() > 0.6 },
        { id: '4', title: 'Evening review', completed: isPast ? Math.random() > 0.1 : Math.random() > 0.3 },
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

  // Get month's tasks organized in calendar format
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  
  // Get the first Monday before or at the start of the month
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  // Get the last Sunday after or at the end of the month
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  // Get all days in the calendar view (including previous/next month days)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Organize into weeks (rows) with 7 days each (columns)
  const calendarWeeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }
  
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(selectedYear, parseInt(monthIndex), 1);
    setSelectedMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
    const newDate = new Date(parseInt(year), selectedMonth.getMonth(), 1);
    setSelectedMonth(newDate);
  };

  const TaskCardComponent = ({ card, size = 'medium', isCurrentMonth = true }: { card: TaskCard; size?: 'small' | 'medium' | 'large'; isCurrentMonth?: boolean }) => {
    const isToday = isSameDay(card.date, new Date());
    const isPast = card.date < new Date() && !isToday;
    const completedTasks = card.tasks.filter(task => task.completed).length;
    const totalTasks = card.tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const cardSizes = {
      small: 'p-3 h-[140px]',
      medium: 'p-4 h-[160px]',
      large: 'p-4 h-[220px]'
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
          ${card.completed && isPast ? 'border-green-500 bg-gray-800 border-green-400 border-2' : 
            card.completed ? 'border-green-500 bg-gray-800 border-green-400' : 
            'bg-gray-800 border-gray-600'}
          ${isToday ? 'ring-2 ring-orange-500 border-orange-500' : ''}
          ${!isCurrentMonth ? 'opacity-30' : ''}
          hover:shadow-lg transition-all duration-200 text-white cursor-pointer
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
              <Badge variant="secondary" className="w-fit bg-orange-500/20 text-orange-300 border-orange-500/40">
                Today
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>{completedTasks}/{totalTasks} tasks</span>
                <span>{Math.round(completionRate)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              {size === 'large' && (
                <div className="space-y-1 mt-2">
                  {card.tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center space-x-2 text-xs">
                      {task.completed ? (
                        <CheckCircle2 className="h-3 w-3 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                  {card.tasks.length > 3 && (
                    <div className="text-xs text-gray-500 ml-5">
                      +{card.tasks.length - 3} more tasks
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <AdminLayout>
      <div className="min-h-screen w-full bg-siso-bg">
        <div className="p-6 space-y-8" style={{ backgroundColor: '#252525' }}>
        <AdminPageTitle
          icon={Lock}
          title="Life Lock"
          subtitle="Track your daily progress with a Notion-style task overview"
        />

        {/* Today's Task Card - Centered */}
        <section className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-white">
            <Calendar className="h-5 w-5 mr-2 text-orange-500" />
            Today's Progress
          </h2>
          <div className="w-full max-w-lg">
            <TaskCardComponent card={todayCard} size="large" />
          </div>
        </section>

        {/* Weekly View */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center text-white">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              This Week
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={() => navigateWeek('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-white">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={() => navigateWeek('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {weekCards.map((card) => (
              <TaskCardComponent key={card.id} card={card} size="medium" />
            ))}
          </div>
        </section>

        {/* Monthly View */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center text-white">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Monthly Overview
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-white">
                {format(selectedMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Month and Year Filters */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Month:</label>
              <Select value={selectedMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[140px] bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()} className="text-white hover:bg-gray-700">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Year:</label>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px] bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-700">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Calendar Grid */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayLabels.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-orange-300 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Weeks */}
            <div className="space-y-2">
              {calendarWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day) => {
                    const card = generateSampleTasks(day);
                    const isCurrentMonth = day.getMonth() === selectedMonth.getMonth();
                    return (
                      <TaskCardComponent 
                        key={card.id} 
                        card={card} 
                        size="small" 
                        isCurrentMonth={isCurrentMonth}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex justify-center">
          <Button 
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3"
            onClick={() => console.log('Add new task')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLifeLock;