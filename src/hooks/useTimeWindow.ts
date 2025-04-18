
import { useState, useEffect, useRef } from 'react';

export const useTimeWindow = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    // Get current time in UK timezone using UTC
    const now = new Date();
    const ukTime = new Date(now.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
    console.log('Initial UK time:', ukTime.toLocaleString('en-GB'));
    return ukTime;
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  const getCurrentWindow = () => {
    const currentHour = currentTime.getHours();
    console.log('Current hour in UK:', currentHour);
    const windowStart = Math.max(0, currentHour - 4);
    const windowEnd = Math.min(24, windowStart + 8);
    return { windowStart, windowEnd };
  };

  const scrollToCurrentTime = () => {
    if (timelineRef.current) {
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      const totalMinutes = currentHour * 60 + currentMinute;
      console.log('Scrolling to UK time:', `${currentHour}:${currentMinute}`);
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
      const ukTime = new Date(now.toLocaleString('en-GB', { timeZone: 'Europe/London' }));
      console.log('Updated UK time:', ukTime.toLocaleString('en-GB'));
      setCurrentTime(ukTime);
      scrollToCurrentTime();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(timer);
  }, []);

  return { currentTime, timelineRef, getCurrentWindow };
};

