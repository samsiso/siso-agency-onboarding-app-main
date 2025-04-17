
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CheckInsView() {
  return (
    <div className="bg-white rounded-md border p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Daily Business Check-In</h2>
        <p className="text-sm text-muted-foreground">
          Reflect on your day to identify successes, improvements, and action items
        </p>
      </div>
      
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">What went well today?</label>
          <Textarea 
            placeholder="List your wins, achievements, and positive outcomes..."
            className="min-h-24"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">What could be improved?</label>
          <Textarea 
            placeholder="Note any challenges, bottlenecks, or areas for growth..."
            className="min-h-24"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Action items for tomorrow</label>
          <Textarea 
            placeholder="List specific tasks or changes to implement..."
            className="min-h-24"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Key metrics & notes</label>
          <Textarea 
            placeholder="Record important numbers, client feedback, or other notes..."
            className="min-h-12"
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto">
          Save Check-In
        </Button>
      </form>
      
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-md font-medium mb-4">Previous Check-Ins</h3>
        <p className="text-sm text-muted-foreground">
          No previous check-ins found. Start by completing today's reflection.
        </p>
      </div>
    </div>
  );
}
