
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CardFooterProps {
  lastUpdated: string;
  readingTime?: number;
  category?: string;
  hasReacted: boolean;
  onReaction: (type: 'like' | 'dislike') => void;
  sourceReferences?: Record<string, any>;
}

export const CardFooter = ({
  lastUpdated,
  readingTime,
  category,
  hasReacted,
  onReaction,
  sourceReferences
}: CardFooterProps) => {
  return (
    <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-gray-400 border-t border-white/10">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {new Date(lastUpdated).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        {readingTime && (
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
        )}
        {category && (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
            {category}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/10"
            onClick={() => onReaction('like')}
            disabled={hasReacted}
          >
            <ThumbsUp className={cn("h-4 w-4", hasReacted && "text-green-500")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/10"
            onClick={() => onReaction('dislike')}
            disabled={hasReacted}
          >
            <ThumbsDown className={cn("h-4 w-4", hasReacted && "text-red-500")} />
          </Button>
        </div>

        {sourceReferences && Object.entries(sourceReferences).map(([key, value]) => (
          <TooltipProvider key={key}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className="bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {key}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>View source: {value as string}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
