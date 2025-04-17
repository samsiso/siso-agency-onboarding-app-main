
import React from 'react';

export const LoadingState = () => {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 w-1/3 bg-siso-text/10 rounded mb-4"></div>
      <div className="aspect-video bg-siso-text/10 rounded-lg mb-4"></div>
      <div className="h-4 w-full bg-siso-text/10 rounded mb-2"></div>
      <div className="h-4 w-4/5 bg-siso-text/10 rounded mb-2"></div>
      <div className="h-4 w-3/5 bg-siso-text/10 rounded mb-2"></div>
    </div>
  );
};

export default LoadingState;
