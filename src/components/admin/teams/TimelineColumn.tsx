
import React, { useEffect, useRef } from 'react';
import { Task } from '@/types/task.types';
import { TaskCard } from './TaskCard';
import { useTimeWindow } from '@/hooks/useTimeWindow';
import { useCheckInOut } from '@/hooks/useCheckInOut';
import { CheckInOutDialog } from './CheckInOutDialog';
import { TimelineRuler } from './timeline/TimelineRuler';
import { ScrollButtons } from './timeline/ScrollButtons';
import { TimeIndicator } from './timeline/TimeIndicator';
import { RoutineIndicator } from './timeline/RoutineIndicator';

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
  const touchStartY = useRef<number | null>(null);

  const { windowStart, windowEnd } = getCurrentWindow();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const HOUR_HEIGHT = 80;
  const PIXELS_PER_MINUTE = HOUR_HEIGHT / 60;
  const timePosition = (currentHour * HOUR_HEIGHT) + (currentMinute * PIXELS_PER_MINUTE);
  const checkInPosition = morningCheckInTime.getHours() * HOUR_HEIGHT;
  const checkOutPosition = eveningCheckOutTime.getHours() * HOUR_HEIGHT + 
                          (eveningCheckOutTime.getMinutes() * PIXELS_PER_MINUTE);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY.current || !timelineRef.current) return;
    
    const deltaY = touchStartY.current - e.touches[0].clientY;
    timelineRef.current.scrollBy({ top: deltaY });
    touchStartY.current = e.touches[0].clientY;
  };

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

  return (
    <div className="relative min-h-[600px] flex">
      <TimelineRuler currentHour={currentHour} />
      <ScrollButtons onScrollUp={scrollUp} onScrollDown={scrollDown} />

      <div 
        ref={timelineRef}
        className="ml-16 relative flex-1 overflow-y-auto hide-scrollbar touch-pan-y"
        style={{
          height: '600px',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <TimeIndicator currentTime={currentTime} position={timePosition} />
        
        <RoutineIndicator
          type="morning"
          position={checkInPosition}
          status={checkInStatus}
          shouldShow={shouldShowMorningCheckIn()}
          onClick={() => setCheckInDialogOpen(true)}
        />
        
        <RoutineIndicator
          type="evening"
          position={checkOutPosition}
          status={checkOutStatus}
          shouldShow={shouldShowEveningCheckOut()}
          onClick={() => setCheckOutDialogOpen(true)}
        />

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
