
import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export const useTimeWindow = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
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
      
      const containerHeight = timelineRef.current.clientHeight;
      const targetPosition = scrollPosition - (containerHeight / 2);
      
      timelineRef.current.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Initial scroll to current time
    setTimeout(scrollToCurrentTime, 100);

    const timer = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return { currentTime, timelineRef, getCurrentWindow };
};
