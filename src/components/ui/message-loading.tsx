
import { cn } from "@/lib/utils";

interface MessageLoadingProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MessageLoading({ className, ...props }: MessageLoadingProps) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <div className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
