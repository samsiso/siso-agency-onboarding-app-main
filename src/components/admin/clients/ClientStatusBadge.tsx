
import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
  status: string;
  className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'pending':
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'completed':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'cancelled':
        return "bg-destructive/10 text-destructive border-destructive/20";
      case 'on hold':
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case 'proposal':
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case 'negotiation':
        return "bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20";
      default:
        return "bg-muted/50 text-muted-foreground border-muted";
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border pill",
        getStatusColor(),
        className
      )}
    >
      {status}
    </div>
  );
}
