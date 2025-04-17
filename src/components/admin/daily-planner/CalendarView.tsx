
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="bg-white rounded-md border p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Calendar View</h2>
        <p className="text-sm text-muted-foreground">Select a date to view or schedule tasks</p>
      </div>
      
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-full max-w-md pointer-events-auto"
        />
      </div>
      
      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Tasks for {date?.toLocaleDateString()}</h3>
        <p className="text-sm text-muted-foreground">
          No tasks scheduled for this date. Click "Add Task" to create one.
        </p>
      </div>
    </div>
  );
}
