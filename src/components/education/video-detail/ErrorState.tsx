
import React from 'react';

// Temporary stub component until the actual component is implemented
export const ErrorState = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-destructive">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3 className="mt-4 font-medium">Error Loading Video</h3>
      <p className="mt-2 text-muted-foreground">{message || "We couldn't load this video. Please try again later."}</p>
    </div>
  );
};
