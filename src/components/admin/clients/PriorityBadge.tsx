
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: string | null | undefined;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityConfig = (priority: string | null | undefined) => {
    if (!priority) return { color: 'text-muted-foreground', bgColor: 'bg-muted/20', label: 'No Priority' };
    
    switch (priority.toLowerCase()) {
      case 'high':
        return { color: 'text-red-500', bgColor: 'bg-red-500/10 border-red-500/30', label: 'High Priority' };
      case 'medium':
        return { color: 'text-amber-500', bgColor: 'bg-amber-500/10 border-amber-500/30', label: 'Medium Priority' };
      case 'low':
        return { color: 'text-green-500', bgColor: 'bg-green-500/10 border-green-500/30', label: 'Low Priority' };
      default:
        return { color: 'text-muted-foreground', bgColor: 'bg-muted/20', label: priority };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-1.5",
        config.bgColor,
        config.color,
        className
      )}
    >
      <Flag className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  );
}
