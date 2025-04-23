
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Task } from "@/types/task.types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { PriorityBadge } from "@/components/admin/teams/PriorityBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TaskDetailDrawerProps {
  task: {
    title: string;
    startAt: Date;
    endAt: Date;
    category: string;
    owner: {
      name: string;
      image: string;
    };
    priority: 'low' | 'medium' | 'high';
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, isOpen, onClose }: TaskDetailDrawerProps) {
  if (!task) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:max-w-[600px] bg-[#1A1F2C] border-l border-[#403E43]/30">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl text-gray-100">{task.title}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={task.owner.image} />
              <AvatarFallback>{task.owner.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-400">Assigned to</p>
              <p className="text-gray-200">{task.owner.name}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Priority</p>
            <PriorityBadge priority={task.priority} />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Category</p>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-400">
              {task.category}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Timeline</p>
            <p className="text-gray-200">
              {format(task.startAt, "MMM d")} - {format(task.endAt, "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
