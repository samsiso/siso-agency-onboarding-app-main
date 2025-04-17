
import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
  status: string;
  className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-500/15 text-green-500 border-green-500/30";
      case 'pending':
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
      case 'completed':
        return "bg-blue-500/15 text-blue-500 border-blue-500/30";
      case 'cancelled':
        return "bg-destructive/15 text-destructive border-destructive/30";
      case 'on hold':
        return "bg-purple-500/15 text-purple-500 border-purple-500/30";
      case 'proposal':
        return "bg-cyan-500/15 text-cyan-500 border-cyan-500/30";
      case 'negotiation':
        return "bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30";
      default:
        return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border pill shadow-sm",
        getStatusColor(),
        className
      )}
    >
      {status}
    </div>
  );
}
