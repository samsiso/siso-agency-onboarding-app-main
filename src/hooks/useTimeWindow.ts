
import { useState, useEffect, useRef } from 'react';

export const useTimeWindow = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    // Initialize with UK time
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  const getCurrentWindow = () => {
    const currentHour = currentTime.getHours();
    const windowStart = Math.max(0, currentHour - 4);
    const windowEnd = Math.min(24, windowStart + 8);
    return { windowStart, windowEnd };
  };

  const scrollToCurrentTime = () => {
    if (timelineRef.current) {
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const totalMinutes = currentHour * 60 + currentMinute;
      const scrollPosition = (totalMinutes / (24 * 60)) * (24 * 80); // 24 hours * 80px per hour
      timelineRef.current.scrollTo({
        top: scrollPosition - (timelineRef.current.clientHeight / 2),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Initial scroll position
    scrollToCurrentTime();

    const timer = setInterval(() => {
      // Update current time with UK timezone
      const now = new Date();
      setCurrentTime(new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })));
      scrollToCurrentTime();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(timer);
  }, []);

  return { currentTime, timelineRef, getCurrentWindow };
};
