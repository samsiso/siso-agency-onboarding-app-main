
import React from 'react';

// Temporary stub component until the actual component is implemented
export const EducationToolbar = () => {
  return (
    <div className="flex justify-between items-center mb-4 pb-2 border-b">
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-muted">All</button>
        <button className="px-3 py-1 rounded">Latest</button>
        <button className="px-3 py-1 rounded">Popular</button>
      </div>
      
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search resources..." 
          className="px-3 py-1 rounded border bg-background"
        />
      </div>
    </div>
  );
};
