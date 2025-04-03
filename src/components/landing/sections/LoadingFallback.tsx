
import React from 'react';

interface LoadingFallbackProps {
  error?: Error;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-siso-bg">
      <div className="text-center">
        {error ? (
          <div className="text-red-500">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p>{error.message || 'An unexpected error occurred'}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-siso-orange rounded-full animate-spin mb-4"></div>
            <p className="text-siso-text-bold">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};
