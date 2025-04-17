
import React from 'react';

// Temporary stub component until the actual component is implemented
export const EducationChat = () => {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4">Education Assistant</h3>
      <div className="bg-muted rounded-md p-3 mb-3">
        <p className="text-sm">Hi! I'm your education assistant. How can I help you learn today?</p>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Ask a question..." 
          className="flex-1 px-3 py-2 rounded border bg-background"
        />
        <button className="px-4 py-2 rounded bg-primary text-primary-foreground">Send</button>
      </div>
    </div>
  );
};
