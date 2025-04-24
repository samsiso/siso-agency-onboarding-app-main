import React from 'react';
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Expand, Clock, Star, FileText, Paperclip, MessageSquare, MessageSquarePlus, Square } from "lucide-react";
import { format } from 'date-fns';
import { UiTask } from './ActiveTasksView';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useSubtasks } from '@/hooks/useSubtasks';
import { SubtaskList } from '@/components/admin/teams/subtasks/SubtaskList';

interface TaskDetailsSheetProps {
  task: UiTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (task: UiTask) => void;
}

export function TaskDetailsSheet({ task, isOpen, onClose, onUpdateTask }: TaskDetailsSheetProps) {
  if (!task) return null;

  const {
    subtasks,
    handleSubtaskToggle,
    handleAddSubtask,
    handleDeleteSubtask,
    getProgress
  } = useSubtasks([
    { id: '1', title: 'Research requirements', completed: false },
    { id: '2', title: 'Create initial mockups', completed: false },
    { id: '3', title: 'Get feedback', completed: false }
  ]);

  const getTimePeriod = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  const progress = getProgress();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[95vw] sm:w-[900px] p-0 bg-background/80 backdrop-blur-xl border-border/20">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <div className="p-6 space-y-6">
            {/* Category & Actions Header */}
            <div className="flex justify-between items-center">
              <Badge 
                variant="outline" 
                className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20"
              >
                {task.category}
              </Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-purple-500/10">
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-purple-500/10">
                  <Expand className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            
            {/* Title & Priority Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">{task.name}</h2>
              <Badge 
                variant="outline" 
                className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
              >
                <Star className="h-3 w-3 mr-1" />
                High Priority
              </Badge>
            </div>

            {/* Time Period Panel */}
            <div className="bg-purple-950/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-purple-300">
                <Clock className="h-4 w-4" />
                <span>{getTimePeriod(task.startAt, task.endAt)}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4" />
                <h3>Description</h3>
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Square className="h-4 w-4" />
                  <h3>Subtasks</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAddSubtask}
                  className="text-xs hover:bg-purple-500/10 text-muted-foreground hover:text-foreground"
                >
                  Add Subtask
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-xs text-muted-foreground min-w-[44px]">
                    {Math.round(progress)}%
                  </span>
                </div>
                
                <SubtaskList
                  subtasks={subtasks}
                  onToggle={handleSubtaskToggle}
                  onDelete={handleDeleteSubtask}
                  className="pl-6"
                />
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Paperclip className="h-4 w-4" />
                <h3>Attachments</h3>
              </div>
              <div className="space-y-2">
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="h-10 w-10 rounded bg-blue-950/50 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Project Brief.pdf</p>
                      <p className="text-xs text-muted-foreground">Added 2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <h3>Comments & Updates</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover:bg-purple-500/10 text-muted-foreground hover:text-foreground"
                >
                  <MessageSquarePlus className="h-3 w-3 mr-1" />
                  Add Comment
                </Button>
              </div>
              
              <div className="rounded-lg bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">No comments or updates yet.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
