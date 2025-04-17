
import React from 'react';

// Temporary stub component until the actual component is implemented
export const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground">Loading video content...</p>
    </div>
  );
};
