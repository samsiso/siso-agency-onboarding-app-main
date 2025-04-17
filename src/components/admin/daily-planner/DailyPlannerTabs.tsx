
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clipboard, LineChart, MessageSquare, Plus, RefreshCw } from 'lucide-react';
import { TaskTable } from './TaskTable';
import { CalendarView } from './CalendarView';
import { CheckInsView } from './CheckInsView';
import { AnalyticsView } from './AnalyticsView';
import { MessagingView } from './MessagingView';

export function DailyPlannerTabs() {
  return (
    <Tabs defaultValue="tasks" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid-cols-5">
          <TabsTrigger value="tasks" className="flex items-center gap-1">
            <Clipboard className="h-4 w-4" />
            <span className="hidden sm:inline">Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="check-ins" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Check-Ins</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="messaging" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messaging</span>
          </TabsTrigger>
        </TabsList>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>
      
      <TabsContent value="tasks" className="space-y-4">
        <TaskTable />
      </TabsContent>
      
      <TabsContent value="calendar" className="space-y-4">
        <CalendarView />
      </TabsContent>
      
      <TabsContent value="check-ins" className="space-y-4">
        <CheckInsView />
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-4">
        <AnalyticsView />
      </TabsContent>
      
      <TabsContent value="messaging" className="space-y-4">
        <MessagingView />
      </TabsContent>
    </Tabs>
  );
}
