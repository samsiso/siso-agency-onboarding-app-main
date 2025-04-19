import React from 'react';
import { Task } from '@/types/task.types';
import { format } from 'date-fns';
import { TaskCard } from './TaskCard';
import { useTaskDragDrop } from '@/hooks/useTaskDragDrop';
import { cn } from '@/lib/utils';
import { useTimeWindow } from '@/hooks/useTimeWindow';
import { ChevronUp, ChevronDown, Clock, Coffee, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { CheckInOutDialog } from './CheckInOutDialog';

export function TimelineColumn({ tasks }: { tasks: Task[] }) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const { currentTime, timelineRef, getCurrentWindow } = useTimeWindow();
  const { handleDrop, handleDragOver, isDragging } = useTaskDragDrop();
  const { 
    morningCheckInTime, 
    eveningCheckOutTime,
    shouldShowMorningCheckIn,
    shouldShowEveningCheckOut,
    handleMorningCheckIn,
    handleEveningCheckOut,
    checkInStatus,
    checkOutStatus
  } = useCheckInOut();
  
  const [checkInDialogOpen, setCheckInDialogOpen] = React.useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = React.useState(false);

  const { windowStart, windowEnd } = getCurrentWindow();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeString = format(currentTime, 'HH:mm');

  // Debug logging
  console.log('Timeline rendering with:', {
    currentTime: currentTime.toLocaleTimeString(),
    currentHour,
    currentMinute
  });

  const scrollUp = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ top: -80, behavior: 'smooth' });
    }
  };

  const scrollDown = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ top: 80, behavior: 'smooth' });
    }
  };

  // Calculate pixels per hour and minute
  const HOUR_HEIGHT = 80; // 80px per hour
  const TOTAL_HOURS = 24;
  const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;
  
  // Calculate the exact position for the current time indicator
  const timePosition = (currentHour * HOUR_HEIGHT) + (currentMinute * PIXELS_PER_MINUTE);
  
  console.log('Time position calculation:', {
    timePosition,
    currentHour,
    currentMinute,
    pixelsPerHour: HOUR_HEIGHT,
    pixelsPerMinute: PIXELS_PER_MINUTE
  });

  // Calculate positions for check-in and check-out indicators
  const checkInPosition = morningCheckInTime.getHours() * HOUR_HEIGHT;
  const checkOutPosition = eveningCheckOutTime.getHours() * HOUR_HEIGHT + 
                          (eveningCheckOutTime.getMinutes() * PIXELS_PER_MINUTE);

  return (
    <div className="relative min-h-[600px] flex">
      {/* Time ruler */}
      <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-200 bg-background z-10">
        {timeSlots.map((hour) => (
          <div
            key={hour}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, hour)}
            className={cn(
              "h-20 flex items-center justify-center text-sm transition-colors relative",
              hour === currentHour && "bg-purple-100/10 font-bold",
              isDragging && "hover:bg-purple-100/5"
            )}
          >
            {`${hour.toString().padStart(2, '0')}:00`}
          </div>
        ))}
      </div>

      {/* Scroll buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-16 top-2 z-20"
        onClick={scrollUp}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-16 bottom-2 z-20"
        onClick={scrollDown}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Tasks container */}
      <div 
        ref={timelineRef}
        className="ml-16 relative flex-1 overflow-y-auto hide-scrollbar"
        style={{
          height: '600px',
          scrollBehavior: 'smooth',
        }}
      >
        {/* Current time indicator */}
        <div 
          className="absolute left-0 right-0 flex items-center gap-2 z-10 transition-all duration-1000"
          style={{
            top: `${timePosition}px`,
          }}
        >
          <div className="border-t-2 border-red-500 flex-1" />
          <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
          <div className="absolute -left-20 -top-3 flex items-center gap-1 text-xs font-medium text-red-500">
            <Clock className="h-3 w-3" />
            {currentTimeString}
          </div>
        </div>

        {/* Morning Routine indicator */}
        <div 
          className={cn(
            "absolute left-0 right-0 flex items-center gap-2 z-10",
            checkInStatus === 'completed' ? "opacity-30" : "opacity-100"
          )}
          style={{
            top: `${checkInPosition}px`,
          }}
        >
          <div className="border-t-2 border-dashed border-green-500 flex-1" />
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "absolute right-2 -top-3 bg-green-50 text-green-700 border-green-300 hover:bg-green-100",
              shouldShowMorningCheckIn() ? "animate-pulse" : ""
            )}
            onClick={() => setCheckInDialogOpen(true)}
          >
            <Coffee className="h-4 w-4 mr-1" />
            {checkInStatus === 'completed' ? "Morning Routine Done" : "Start Morning Routine"}
          </Button>
        </div>
        
        {/* Evening Check-Out indicator */}
        <div 
          className={cn(
            "absolute left-0 right-0 flex items-center gap-2 z-10",
            checkOutStatus === 'completed' ? "opacity-30" : "opacity-100"
          )}
          style={{
            top: `${checkOutPosition}px`,
          }}
        >
          <div className="border-t-2 border-dashed border-purple-500 flex-1" />
          <Button 
            variant="outline" 
            size="sm"
            className={cn(
              "absolute right-2 -top-3 bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100",
              shouldShowEveningCheckOut() ? "animate-pulse" : ""
            )}
            onClick={() => setCheckOutDialogOpen(true)}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {checkOutStatus === 'completed' ? "Checked Out" : "Check Out"}
          </Button>
        </div>

        {/* Visible window indicator */}
        <div 
          className="absolute left-0 right-0 bg-purple-50/5 border-y border-purple-500/20"
          style={{
            top: `${windowStart * HOUR_HEIGHT}px`,
            height: `${(windowEnd - windowStart) * HOUR_HEIGHT}px`,
          }}
        />

        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task}
            currentHour={currentHour}
          />
        ))}
      </div>

      {/* Dialogs */}
      <CheckInOutDialog
        type="check-in"
        open={checkInDialogOpen}
        onOpenChange={setCheckInDialogOpen}
        onComplete={handleMorningCheckIn}
        time={morningCheckInTime}
      />
      
      <CheckInOutDialog
        type="check-out"
        open={checkOutDialogOpen}
        onOpenChange={setCheckOutDialogOpen}
        onComplete={handleEveningCheckOut}
        time={eveningCheckOutTime}
      />
    </div>
  );
}
