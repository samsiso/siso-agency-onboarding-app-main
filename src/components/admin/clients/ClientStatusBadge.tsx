
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClientStatusBadgeProps {
  status: string;
  className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 hover:bg-green-500/20';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/20';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/20';
      default:
        return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/20';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <Badge variant="outline" className={cn(getStatusColor(), className)}>
      {getStatusText()}
    </Badge>
  );
}
