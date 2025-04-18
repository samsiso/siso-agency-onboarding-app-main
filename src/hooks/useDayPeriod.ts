
import { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise } from 'lucide-react';

export const useDayPeriod = () => {
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState<any>(Sun);
  const [gradientClass, setGradientClass] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        setGreeting('Good morning');
        setIcon(Sunrise);
        setGradientClass('from-orange-500/40 via-yellow-500/30 to-yellow-600/40');
      } else if (hour < 18) {
        setGreeting('Good afternoon');
        setIcon(Sun);
        setGradientClass('from-blue-500/40 via-sky-500/30 to-indigo-500/40');
      } else {
        setGreeting('Good evening');
        setIcon(Moon);
        setGradientClass('from-indigo-900/40 via-purple-800/30 to-purple-900/40');
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return { greeting, icon: icon, gradientClass };
};
