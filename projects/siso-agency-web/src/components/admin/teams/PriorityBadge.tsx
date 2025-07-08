
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flame, AlertCircle, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskPriority } from '@/types/task.types';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return {
          icon: Flame,
          text: 'Urgent',
          className: 'bg-red-500/10 text-red-500 border-red-500/30'
        };
      case 'high':
        return {
          icon: AlertCircle,
          text: 'High',
          className: 'bg-amber-500/10 text-amber-500 border-amber-500/30'
        };
      case 'medium':
        return {
          icon: ArrowUp,
          text: 'Medium',
          className: 'bg-purple-500/10 text-purple-500 border-purple-500/30'
        };
      default:
        return {
          icon: Minus,
          text: 'Low',
          className: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn("flex items-center gap-1", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}
