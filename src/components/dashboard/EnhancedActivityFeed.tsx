import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Calendar, 
  FileText, 
  MessageSquare, 
  DollarSign,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: 'deadline' | 'document' | 'meeting' | 'payment' | 'task' | 'client';
  time: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

// Enhanced activity data - broader than just notifications
const activities: ActivityItem[] = [
  {
    id: '1',
    title: 'Payment received',
    description: 'Gritness Gym - £995 project payment',
    type: 'payment',
    time: '2 hours ago',
    priority: 'high',
    read: false
  },
  {
    id: '2',
    title: 'Task deadline approaching',
    description: 'UbahCrypt smart contract audit due tomorrow',
    type: 'deadline',
    time: '4 hours ago',
    priority: 'high',
    read: false
  },
  {
    id: '3',
    title: 'New client message',
    description: 'Optimal Construction: project scope questions',
    type: 'client',
    time: '6 hours ago',
    priority: 'medium',
    read: true
  },
  {
    id: '4',
    title: 'Task completed',
    description: 'Database setup for Lets Go project',
    type: 'task',
    time: '8 hours ago',
    priority: 'low',
    read: true
  },
  {
    id: '5',
    title: 'Document updated',
    description: 'Mu Shin project requirements updated',
    type: 'document',
    time: 'Yesterday',
    priority: 'medium',
    read: true
  }
];

export function EnhancedActivityFeed() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deadline': return Calendar;
      case 'document': return FileText;
      case 'meeting': return MessageSquare;
      case 'payment': return DollarSign;
      case 'task': return CheckCircle;
      case 'client': return User;
      default: return Bell;
    }
  };

  const getActivityColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-400 bg-red-500/10';
    
    switch (type) {
      case 'payment': return 'text-green-400 bg-green-500/10';
      case 'deadline': return 'text-orange-400 bg-orange-500/10';
      case 'task': return 'text-blue-400 bg-blue-500/10';
      case 'client': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const unreadCount = activities.filter(a => !a.read).length;

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-white">
          <Bell className="h-5 w-5 text-orange-500" />
          Activity Feed
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2 bg-red-500/90">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type, activity.priority);
            
            return (
              <motion.div 
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg flex gap-3 items-start transition-all duration-200 hover:bg-white/5 ${
                  activity.read 
                    ? 'opacity-70' 
                    : 'bg-gradient-to-r from-orange-500/5 to-black/20 border-l-2 border-orange-500'
                }`}
              >
                <div className={`rounded-full p-2 ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-medium text-white truncate">
                      {activity.title}
                    </h4>
                    <span className="text-xs text-gray-400 shrink-0">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  {activity.priority === 'high' && !activity.read && (
                    <Badge variant="destructive" className="mt-2 text-xs bg-red-500/20 text-red-300">
                      High Priority
                    </Badge>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="pt-3 border-t border-white/10 mt-4">
          <p className="text-xs text-gray-400 text-center">
            Stay updated with all agency activity
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 