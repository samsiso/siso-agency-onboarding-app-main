
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Calendar, FileText, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Sample notifications - in a real app, these would come from an API
const notifications = [
  {
    id: 1,
    title: "Task deadline approaching",
    description: "Smart contract audit due in 2 days",
    type: "deadline",
    time: "2 days",
    read: false
  },
  {
    id: 2,
    title: "Document shared with you",
    description: "Project scope document updated",
    type: "document",
    time: "4 hours ago",
    read: false
  },
  {
    id: 3,
    title: "Team meeting scheduled",
    description: "Weekly standup at 9:30 AM",
    type: "meeting",
    time: "Tomorrow",
    read: true
  }
];

export function NotificationsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-siso-border bg-black/30 hover:border-siso-orange/30 transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="mr-2 h-5 w-5 text-siso-orange" />
            Recent Notifications
          </CardTitle>
          <Badge className="bg-siso-red text-white">{notifications.filter(n => !n.read).length}</Badge>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg flex gap-3 items-start ${notification.read ? 'bg-black/20' : 'bg-gradient-to-r from-siso-orange/10 to-black/20 border-l-2 border-siso-orange'}`}
              >
                <div className="rounded-full p-2 bg-black/30 text-siso-orange">
                  {notification.type === 'deadline' && <Calendar className="h-4 w-4" />}
                  {notification.type === 'document' && <FileText className="h-4 w-4" />}
                  {notification.type === 'meeting' && <MessageSquare className="h-4 w-4" />}
                </div>
                <div className="flex-grow">
                  <div className="text-sm font-medium text-white">{notification.title}</div>
                  <div className="text-xs text-siso-text">{notification.description}</div>
                  <div className="text-xs text-siso-text mt-1">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
