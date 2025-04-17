
import React from 'react';

export const ErrorState = ({ message }: { message?: string }) => {
  return (
    <div className="p-6 text-center">
      <div className="text-red-500 text-xl mb-2">Error loading video</div>
      {message && <p className="text-siso-text/70">{message}</p>}
      <button className="mt-4 px-4 py-2 bg-siso-text/10 hover:bg-siso-text/20 rounded-md text-siso-text-bold">
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
