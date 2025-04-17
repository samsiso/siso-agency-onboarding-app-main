
import { cn } from "@/lib/utils";

interface ClientStatusBadgeProps {
  status: string;
  className?: string;
}

export function ClientStatusBadge({ status, className }: ClientStatusBadgeProps) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return "bg-green-500/15 text-green-500 border-green-500/30 shadow-green-500/10";
      case 'pending':
        return "bg-amber-500/15 text-amber-500 border-amber-500/30 shadow-amber-500/10";
      case 'completed':
        return "bg-blue-500/15 text-blue-500 border-blue-500/30 shadow-blue-500/10";
      case 'cancelled':
        return "bg-destructive/15 text-destructive border-destructive/30 shadow-destructive/10";
      case 'on hold':
        return "bg-purple-500/15 text-purple-500 border-purple-500/30 shadow-purple-500/10";
      case 'proposal':
        return "bg-cyan-500/15 text-cyan-500 border-cyan-500/30 shadow-cyan-500/10";
      case 'negotiation':
        return "bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30 shadow-fuchsia-500/10";
      default:
        return "bg-muted/50 text-muted-foreground border-muted shadow-muted/10";
    }
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold border pill shadow-sm transition-all",
        getStatusColor(),
        className
      )}
    >
      {status}
    </div>
  );
}
