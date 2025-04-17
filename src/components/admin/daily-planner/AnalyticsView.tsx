
import React from 'react';

export function AnalyticsView() {
  return (
    <div className="bg-white rounded-md border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Task & Productivity Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Track your productivity metrics and task completion rates
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-md border">
          <h3 className="text-sm font-medium text-muted-foreground">Task Completion Rate</h3>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-xs text-muted-foreground">No tasks completed yet</p>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md border">
          <h3 className="text-sm font-medium text-muted-foreground">Check-Ins Completed</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">Start your first check-in today</p>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md border">
          <h3 className="text-sm font-medium text-muted-foreground">Tasks Created</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">Add your first task to get started</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium mb-2">Task Completion Trend</h3>
        <div className="h-64 bg-slate-50 rounded-md border flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Not enough data to display trends. Add and complete tasks to see analytics.
          </p>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Category Distribution</h3>
        <div className="h-64 bg-slate-50 rounded-md border flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Add tasks with different categories to see distribution.
          </p>
        </div>
      </div>
    </div>
  );
}
