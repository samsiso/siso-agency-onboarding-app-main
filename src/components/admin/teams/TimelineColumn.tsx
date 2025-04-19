import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { TaskCard } from './TaskCard';
import { useTimeWindow } from '@/hooks/useTimeWindow';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { CheckInOutDialog } from './CheckInOutDialog';
import { TimelineRuler } from './timeline/TimelineRuler';
import { ScrollButtons } from './timeline/ScrollButtons';
import { TimeIndicator } from './timeline/TimeIndicator';
import { RoutineCard } from './timeline/RoutineCard';
import { cn } from '@/lib/utils';
import { TaskCreationDialog } from './TaskCreationDialog';
import { TimelineHeader } from './timeline/TimelineHeader';
import { TimelineGrid } from './timeline/TimelineGrid';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HOUR_HEIGHT = 100; // Standardized height

export function TimelineColumn({ tasks }: { tasks: Task[] }) {
  const { currentTime, timelineRef, getCurrentWindow } = useTimeWindow();
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
  
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
  const [taskCreationOpen, setTaskCreationOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined);

  const { windowStart, windowEnd } = getCurrentWindow();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const allTasks = [...tasks].sort((a, b) => {
    if (!a.start_time || !b.start_time) return 0;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  const timePosition = (currentHour * HOUR_HEIGHT) + (currentMinute * (HOUR_HEIGHT / 60));

  const handleCreateTask = (hour?: number) => {
    setSelectedHour(hour);
    setTaskCreationOpen(true);
  };
  
  const handleTimeSlotClick = (hour: number) => {
    handleCreateTask(hour);
  };

  return (
    <div className="flex flex-col h-full">
      <TimelineHeader 
        onCreateTask={() => handleCreateTask()}
        currentDate={currentTime}
      />
      
      <div className="relative flex-1 h-full overflow-hidden">
        <div 
          ref={timelineRef}
          className="absolute inset-0 overflow-y-auto hide-scrollbar"
        >
          <div className="relative ml-12 sm:ml-16">
            <div className="relative" style={{ height: `${24 * HOUR_HEIGHT}px` }}>
              <TimelineGrid hourHeight={HOUR_HEIGHT} />
              <TimelineRuler 
                currentHour={currentHour} 
                hourHeight={HOUR_HEIGHT}
                onTimeSlotClick={handleTimeSlotClick}
              />
              
              <TimeIndicator currentTime={currentTime} position={timePosition} />

              {shouldShowMorningCheckIn() && (
                <RoutineCard
                  type="morning"
                  time={morningCheckInTime}
                  status={checkInStatus}
                  onClick={() => setCheckInDialogOpen(true)}
                />
              )}
              
              {shouldShowEveningCheckOut() && (
                <RoutineCard
                  type="evening"
                  time={eveningCheckOutTime}
                  status={checkOutStatus}
                  onClick={() => setCheckOutDialogOpen(true)}
                />
              )}

              <div 
                className="absolute left-0 right-2 sm:right-4 bg-purple-50/5 border-y border-purple-500/20"
                style={{
                  top: `${windowStart * HOUR_HEIGHT}px`,
                  height: `${(windowEnd - windowStart) * HOUR_HEIGHT}px`,
                }}
              />

              {allTasks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6 max-w-xs mx-auto">
                    <div className="rounded-full bg-gray-100 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No tasks scheduled</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click on a time slot or use the create button to add tasks to your schedule
                    </p>
                    <Button onClick={() => handleCreateTask()}>
                      Create Task
                    </Button>
                  </div>
                </div>
              )}

              {allTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task}
                  currentHour={currentHour}
                  allTasks={allTasks}
                />
              ))}
            </div>
          </div>
        </div>

        <ScrollButtons 
          onScrollUp={() => timelineRef.current?.scrollBy({ top: -HOUR_HEIGHT, behavior: 'smooth' })} 
          onScrollDown={() => timelineRef.current?.scrollBy({ top: HOUR_HEIGHT, behavior: 'smooth' })} 
        />
      </div>

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
      
      <TaskCreationDialog
        isOpen={taskCreationOpen}
        onClose={() => setTaskCreationOpen(false)}
        initialHour={selectedHour}
      />
    </div>
  );
}
