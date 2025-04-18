
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

  const scrollToCurrentTime = () => {
    if (timelineRef.current) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
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
      setCurrentTime(new Date());
      scrollToCurrentTime();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(timer);
  }, []);

  return { currentTime, timelineRef, getCurrentWindow };
};
