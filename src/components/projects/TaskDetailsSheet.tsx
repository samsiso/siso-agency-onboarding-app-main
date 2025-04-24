
import React from 'react';
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Expand, Clock, Star, FileText, Paperclip, MessageSquare, MessageSquarePlus } from "lucide-react";
import { format } from 'date-fns';
import { UiTask } from './ActiveTasksView';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
      <SheetContent className="w-[90vw] sm:w-[600px] p-0 bg-[#f8f9fa]">
        <ScrollArea className="h-[calc(100vh-2rem)]">
          <div className="p-6">
            {/* Category & Actions Header */}
            <div className="flex justify-between items-center mb-6">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">
                {task.category}
              </Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Share2 className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Expand className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>
            
            {/* Title & Priority Section */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900">{task.name}</h2>
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                <Star className="h-3 w-3 mr-1" />
                High Priority
              </Badge>
            </div>

            {/* Time Period Panel */}
            <div className="bg-purple-50 rounded-lg p-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-purple-700">
                <Clock className="h-4 w-4" />
                <span>{getTimePeriod(task.startAt, task.endAt)}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <FileText className="h-4 w-4" />
                <h3>Description</h3>
              </div>
              <p className="text-sm text-gray-600 pl-6">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Paperclip className="h-4 w-4" />
                <h3>Attachments</h3>
              </div>
              <div className="space-y-2">
                <div className="pl-6 space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Project Brief.pdf</p>
                      <p className="text-xs text-gray-500">Added 2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                  <MessageSquare className="h-4 w-4" />
                  <h3>Comments & Updates</h3>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  <MessageSquarePlus className="h-3 w-3 mr-1" />
                  Add Comment
                </Button>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">No comments or updates yet.</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
