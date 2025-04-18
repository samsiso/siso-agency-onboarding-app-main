import { useState, useEffect, useRef } from 'react';

export const useTimeWindow = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const timelineRef = useRef<HTMLDivElement>(null);

  const getCurrentWindow = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const windowStart = Math.max(0, currentHour - 4);
    const windowEnd = Math.min(24, windowStart + 8);
    return { windowStart, windowEnd };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Scroll to keep current time in view
      if (timelineRef.current) {
        const { windowStart } = getCurrentWindow();
        const currentHour = new Date().getHours();
        const scrollPosition = (currentHour - windowStart) * 80; // 80px per hour
        timelineRef.current.scrollTop = scrollPosition - 160; // Center in viewport
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return { currentTime, timelineRef, getCurrentWindow };
};
