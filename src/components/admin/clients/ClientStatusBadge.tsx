
import { Badge } from '@/components/ui/badge';
import { 
  CircleCheck, 
  Clock, 
  FileText, 
  HandCoins,
  Hourglass,
  Pause,
  AlertCircle
} from 'lucide-react';

interface ClientStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ClientStatusBadge({ status, size = 'md' }: ClientStatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs py-0 px-2',
    md: 'text-xs py-1 px-2',
    lg: 'text-sm py-1 px-3'
  };

  // Predefined statuses with consistent styling
  const badgeConfig: Record<string, { label: string, icon: React.ReactNode, className: string }> = {
    active: { 
      label: 'Active', 
      icon: <CircleCheck className="w-3 h-3 mr-1" />, 
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    pending: { 
      label: 'Pending', 
      icon: <Clock className="w-3 h-3 mr-1" />, 
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    proposal: { 
      label: 'Proposal', 
      icon: <FileText className="w-3 h-3 mr-1" />, 
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    negotiation: { 
      label: 'Negotiation', 
      icon: <HandCoins className="w-3 h-3 mr-1" />, 
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    },
    in_progress: { 
      label: 'In Progress', 
      icon: <Hourglass className="w-3 h-3 mr-1" />, 
      className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
    },
    paused: { 
      label: 'Paused', 
      icon: <Pause className="w-3 h-3 mr-1" />, 
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    },
    completed: { 
      label: 'Completed', 
      icon: <CircleCheck className="w-3 h-3 mr-1" />, 
      className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400'
    },
    cancelled: { 
      label: 'Cancelled', 
      icon: <AlertCircle className="w-3 h-3 mr-1" />, 
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
  };

  // Default/fallback for unrecognized statuses
  const defaultConfig = { 
    label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '), 
    icon: <Clock className="w-3 h-3 mr-1" />, 
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  };

  const { label, icon, className } = badgeConfig[status.toLowerCase()] || defaultConfig;

  return (
    <Badge 
      variant="outline" 
      className={`${className} ${sizeClasses[size]} font-normal flex w-fit items-center`}
    >
      {icon}
      {label}
    </Badge>
  );
}
