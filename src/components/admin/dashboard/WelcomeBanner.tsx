
import { UserCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface WelcomeBannerProps {
  user: any;
}

export function WelcomeBanner({ user }: WelcomeBannerProps) {
  const [greeting, setGreeting] = useState('Welcome');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Format current time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const userName = user?.email ? user.email.split('@')[0] : 'Admin';

  return (
    <Card className="border-0 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="h-12 w-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-200">
              <UserCircle className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {greeting}, {userName}
              </h1>
              <p className="text-purple-200/80">
                Welcome to your admin dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center text-purple-200/80">
            <Clock className="h-5 w-5 mr-2" />
            <span>{currentTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
