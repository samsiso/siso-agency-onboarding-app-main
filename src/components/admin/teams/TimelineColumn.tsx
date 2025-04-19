
import React, { useState } from 'react';
import { Task } from '@/types/task.types';
import { TaskCard } from './TaskCard';
import { useTimeWindow } from '@/hooks/useTimeWindow';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { CheckInOutDialog } from './CheckInOutDialog';
import { TimelineRuler } from './timeline/TimelineRuler';
import { TimeIndicator } from './timeline/TimeIndicator';
import { RoutineCard } from './timeline/RoutineCard';
import { cn } from '@/lib/utils';
import { TaskCreationDialog } from './TaskCreationDialog';
import { TimelineHeader } from './timeline/TimelineHeader';
import { TimelineGrid } from './timeline/TimelineGrid';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TimelineColumn({ tasks }: { tasks: Task[] }) {
  const { currentTime, timelineRef, getCurrentWindow, scrollToCurrentTime } = useTimeWindow();
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

  const handleCreateTask = (hour?: number) => {
    setSelectedHour(hour);
    setTaskCreationOpen(true);
  };
  
  const handleTimeSlotClick = (hour: number) => {
    handleCreateTask(hour);
  };

  return (
    <div className="relative min-h-[600px] flex">
      <TimelineRuler 
        currentHour={currentHour} 
        hourHeight={100}
        onTimeSlotClick={handleTimeSlotClick}
      />
      
      <div className="ml-12 sm:ml-16 relative flex-1">
        <TimelineHeader 
          onCreateTask={() => handleCreateTask()}
          currentDate={currentTime}
        />
        
        <ScrollArea 
          ref={timelineRef}
          className="h-[calc(100vh-220px)]"
        >
          <div className="relative px-1 sm:px-2 min-h-[2400px]">
            <TimelineGrid hourHeight={100} />
            <TimeIndicator currentTime={currentTime} position={currentHour * 100 + (currentMinute / 60) * 100} />
            
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

            {allTasks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center h-[600px]">
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
        </ScrollArea>
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
