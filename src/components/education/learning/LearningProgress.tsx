
import React from 'react';

// Temporary stub component until the actual component is implemented
export const LearningProgress = () => {
  return (
    <div className="mb-6 p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Learning Progress</h3>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>Progress: 45%</span>
        <span>9/20 Completed</span>
      </div>
    </div>
  );
};
