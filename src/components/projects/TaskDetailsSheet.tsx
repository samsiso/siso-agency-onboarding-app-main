
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Share2, Expand, Clock, Star, FileText, Paperclip, MessageSquare, MessageSquarePlus } from "lucide-react";
import { format } from 'date-fns';
import { UiTask } from './ActiveTasksView';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskDetailsSheetProps {
  task: UiTask | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask?: (task: UiTask) => void;
}

export function TaskDetailsSheet({ task, isOpen, onClose, onUpdateTask }: TaskDetailsSheetProps) {
  if (!task) return null;

  const getTimePeriod = (start: Date, end: Date) => {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] sm:w-[600px] p-0 bg-[#1A1F2C]">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <div className="p-6">
            {/* Header Section */}
            <SheetHeader className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Expand className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-left">
                <SheetTitle className="text-xl font-semibold">{task.name}</SheetTitle>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  <Star className="h-3 w-3 mr-1" />
                  High Priority
                </Badge>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Time Spent Section */}
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>{getTimePeriod(task.startAt, task.endAt)}</span>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  <h3>Description</h3>
                </div>
                <p className="text-sm text-gray-400 pl-6">
                  {task.description || "No description provided."}
                </p>
              </div>

              {/* Attachments Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Paperclip className="h-4 w-4" />
                  <h3>Attachments</h3>
                </div>
                <div className="pl-6 text-sm text-gray-400">
                  No attachments yet.
                </div>
              </div>

              <Separator className="my-6" />

              {/* Comments & Updates Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="h-4 w-4" />
                    <h3>Comments & Updates</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <MessageSquarePlus className="h-3 w-3 mr-1" />
                    Add Update
                  </Button>
                </div>
                
                <div className="rounded-lg bg-black/20 p-4">
                  <p className="text-sm text-gray-400">No comments or updates yet.</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
