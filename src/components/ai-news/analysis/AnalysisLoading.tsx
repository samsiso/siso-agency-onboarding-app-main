
import React from 'react';

export const AnalysisLoading: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-400">Analyzing article content...</p>
      <p className="text-xs text-gray-500 mt-2">This may take up to 30 seconds</p>
    </div>
  );
};
