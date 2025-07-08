
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Clock, CheckSquare, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  actionButton?: string;
  actionLink?: string;
  onClick?: () => void;
}

const priorityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-red-500/20 text-red-400',
};

const priorityIcons = {
  low: <Clock className="h-3.5 w-3.5" />,
  medium: <CheckSquare className="h-3.5 w-3.5" />,
  high: <AlertTriangle className="h-3.5 w-3.5" />,
};

export function TaskCard({ 
  name, 
  startAt, 
  endAt, 
  category, 
  owner, 
  priority,
  status,
  actionButton,
  actionLink,
  onClick 
}: TaskCardProps) {
  const navigate = useNavigate();
  const daysLeft = Math.ceil((endAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;
  
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionLink) {
      navigate(actionLink);
    }
  };
  
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-2.5 p-5 rounded-lg bg-gradient-to-br from-[#1f2533]/90 to-[#252229]/90 border border-[#3a3942]/50 backdrop-blur-sm transition-all hover:border-[#9b87f5]/60 hover:shadow-lg hover:scale-[1.01] cursor-pointer animate-fade-in shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[15px] font-medium text-gray-100">{name}</h3>
          <div className="flex items-center gap-1.5">
            <Badge 
              variant="outline" 
              className={cn(
                'flex items-center gap-1 text-[10px] py-0.5 border-opacity-40',
                priorityColors[priority]
              )}
            >
              {priorityIcons[priority]}
              <span className="capitalize">{priority}</span>
            </Badge>
            
            {status && (
              <Badge 
                className="text-[10px] py-0.5"
                style={{ 
                  backgroundColor: `${status.color}20`, 
                  color: status.color 
                }}
              >
                {status.name}
              </Badge>
            )}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className="h-7 w-7 ring-1 ring-[#9b87f5]/30">
                <AvatarImage src={owner.image} />
                <AvatarFallback className="bg-[#1f2533] text-xs">{owner.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>Assigned to {owner.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className="w-fit text-[10px] py-0.5 bg-purple-500/20 text-purple-400 border-purple-500/30"
          >
            {category}
          </Badge>
          
          <span className={cn(
            "text-xs px-2.5 py-1 rounded-full",
            isOverdue 
              ? "bg-red-500/20 text-red-400" 
              : daysLeft <= 2 
              ? "bg-amber-500/20 text-amber-400" 
              : "bg-green-500/20 text-green-400"
          )}>
            {isOverdue 
              ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'}` 
              : daysLeft === 0 
              ? "Due today" 
              : status?.name === "Done"
              ? "Completed"
              : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
          </span>
        </div>
        
        {actionButton && (
          <Button 
            size="sm" 
            className="w-full mt-2 bg-[#0078D4] hover:bg-[#1A91FF] text-white transition-all hover:scale-[1.02] font-medium"
            onClick={handleActionClick}
          >
            {actionButton}
          </Button>
        )}
        
        {!actionButton && status?.name !== "Done" && (
          <span className="text-xs text-[#aaadb0] mt-1">
            {format(startAt, 'MMM d')} - {format(endAt, 'MMM d, yyyy')}
          </span>
        )}
        
        {status?.name === "Done" && (
          <span className="text-xs text-[#10B981] mt-1 flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5" />
            Completed {format(endAt, 'MMM d, yyyy')}
          </span>
        )}
      </div>
    </div>
  );
}
