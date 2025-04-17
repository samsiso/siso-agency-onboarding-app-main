
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
  status: string;
  className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          bgColor: 'bg-green-500/20',
          textColor: 'text-green-500',
          hoverBg: 'hover:bg-green-500/30',
          label: 'Active'
        };
      case 'pending':
        return {
          bgColor: 'bg-amber-500/20',
          textColor: 'text-amber-500',
          hoverBg: 'hover:bg-amber-500/30',
          label: 'Pending'
        };
      case 'proposal':
        return {
          bgColor: 'bg-blue-500/20',
          textColor: 'text-blue-500',
          hoverBg: 'hover:bg-blue-500/30',
          label: 'Proposal'
        };
      case 'negotiation':
        return {
          bgColor: 'bg-purple-500/20',
          textColor: 'text-purple-500',
          hoverBg: 'hover:bg-purple-500/30',
          label: 'Negotiation'
        };
      case 'completed':
        return {
          bgColor: 'bg-teal-500/20',
          textColor: 'text-teal-500',
          hoverBg: 'hover:bg-teal-500/30',
          label: 'Completed'
        };
      case 'inactive':
        return {
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-500',
          hoverBg: 'hover:bg-gray-500/30',
          label: 'Inactive'
        };
      case 'in_progress':
        return {
          bgColor: 'bg-indigo-500/20',
          textColor: 'text-indigo-500',
          hoverBg: 'hover:bg-indigo-500/30',
          label: 'In Progress'
        };
      default:
        return {
          bgColor: 'bg-gray-500/20',
          textColor: 'text-gray-500',
          hoverBg: 'hover:bg-gray-500/30',
          label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      className={cn(
        config.bgColor, 
        config.textColor, 
        config.hoverBg,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
