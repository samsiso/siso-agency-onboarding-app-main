
import { CalendarX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsEmptyStateProps {
  message?: string;
  suggestion?: string;
  onRefresh?: () => void;
}

export const NewsEmptyState = ({ 
  message = "No articles found", 
  suggestion = "Try changing your filters or syncing new content.",
  onRefresh
}: NewsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="bg-gray-800/30 rounded-full p-3">
        <CalendarX className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium">{message}</h3>
      <p className="text-gray-400 max-w-md">
        {suggestion}
      </p>
      {onRefresh && (
        <Button 
          variant="outline" 
          onClick={onRefresh}
          className="mt-4 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Content
        </Button>
      )}
    </div>
  );
};
