
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface TaskCardProps {
  name: string;
  startAt: Date;
  endAt: Date;
  category: string;
  owner: {
    name: string;
    image: string;
  };
  priority: 'low' | 'medium' | 'high';
  status?: {
    name: string;
    color: string;
  };
  description?: string;
  onClick?: () => void;
}

const priorityColors = {
  low: 'bg-blue-500/20 text-blue-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-red-500/20 text-red-400',
};

export function TaskCard({ 
  name, 
  startAt, 
  endAt, 
  category, 
  owner, 
  priority,
  onClick 
}: TaskCardProps) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-2 p-3 rounded-lg bg-black/40 border border-white/5 backdrop-blur-sm transition-all hover:bg-black/60 hover:border-white/10 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-gray-200">{name}</h3>
          <Badge 
            variant="outline" 
            className={cn(
              'w-fit text-[10px]',
              priorityColors[priority]
            )}
          >
            {priority}
          </Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="h-6 w-6">
                <AvatarImage src={owner.image} />
                <AvatarFallback>{owner.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Assigned to {owner.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">
          {format(startAt, 'MMM d')} - {format(endAt, 'MMM d, yyyy')}
        </span>
        <Badge variant="outline" className="w-fit text-[10px] bg-purple-500/20 text-purple-400">
          {category}
        </Badge>
      </div>
    </div>
  );
}
