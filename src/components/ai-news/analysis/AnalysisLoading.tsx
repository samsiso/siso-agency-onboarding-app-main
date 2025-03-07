
import React from 'react';

export const AnalysisLoading: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 blur-lg opacity-50 animate-pulse"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4 relative z-10"></div>
      </div>
      
      <p className="text-gray-300 mt-4 font-medium">Analyzing article content...</p>
      
      <div className="flex flex-col items-center mt-2 max-w-md text-center">
        <p className="text-xs text-gray-400">Using AI to extract key insights and business implications</p>
        <div className="mt-4 w-full max-w-xs bg-gray-800 rounded-full h-1.5">
          <div className="bg-blue-500 h-1.5 rounded-full animate-[loadingBar_2s_ease-in-out_infinite]"></div>
        </div>
        <style jsx>{`
          @keyframes loadingBar {
            0% { width: 0%; }
            50% { width: 70%; }
            70% { width: 90%; }
            100% { width: 95%; }
          }
        `}</style>
      </div>
    </div>
  );
};
