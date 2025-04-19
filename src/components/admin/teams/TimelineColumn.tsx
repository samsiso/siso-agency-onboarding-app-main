
import React from 'react';
import { Task } from '@/types/task.types';
import { TaskCard } from './TaskCard';
import { useTimeWindow } from '@/hooks/useTimeWindow';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { CheckInOutDialog } from './CheckInOutDialog';
import { TimelineRuler } from './timeline/TimelineRuler';
import { ScrollButtons } from './timeline/ScrollButtons';
import { TimeIndicator } from './timeline/TimeIndicator';
import { RoutineCard } from './timeline/RoutineCard';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  
  const [checkInDialogOpen, setCheckInDialogOpen] = React.useState(false);
  const [checkOutDialogOpen, setCheckOutDialogOpen] = React.useState(false);

  const { windowStart, windowEnd } = getCurrentWindow();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Test task for SISO Agency App Dev
  const testTask: Task = {
    id: 'test-task',
    title: 'SISO Agency App Development',
    description: 'Work on core features and improvements',
    status: 'in_progress',
    priority: 'high',
    category: 'siso_app_dev',
    created_at: new Date().toISOString(),
    start_time: (() => {
      const time = new Date();
      time.setHours(10, 0, 0, 0);
      return time.toISOString();
    })(),
    duration: 60
  };

  const allTasks = [...tasks, testTask].sort((a, b) => {
    if (!a.start_time || !b.start_time) return 0;
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
  });

  const HOUR_HEIGHT = 80;
  const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;
  const timePosition = (currentHour * HOUR_HEIGHT) + (currentMinute * PIXELS_PER_MINUTE);
  const checkInPosition = morningCheckInTime.getHours() * HOUR_HEIGHT;
  const checkOutPosition = eveningCheckOutTime.getHours() * HOUR_HEIGHT + 
                          (eveningCheckOutTime.getMinutes() * PIXELS_PER_MINUTE);

  return (
    <div className="relative min-h-[600px] flex">
      <TimelineRuler currentHour={currentHour} />
      <ScrollButtons 
        onScrollUp={() => timelineRef.current?.scrollBy({ top: -80, behavior: 'smooth' })} 
        onScrollDown={() => timelineRef.current?.scrollBy({ top: 80, behavior: 'smooth' })} 
      />

      <div className="ml-16 relative flex-1">
        <ScrollArea 
          ref={timelineRef}
          className="h-[600px] relative"
          scrollHideDelay={0}
        >
          <div className="relative min-h-[1920px] px-4">
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
              className="absolute left-0 right-0 bg-purple-50/5 border-y border-purple-500/20"
              style={{
                top: `${windowStart * 80}px`,
                height: `${(windowEnd - windowStart) * 80}px`,
              }}
            />

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
    </div>
  );
}
