
import React from 'react';

export const LearningProgress = () => {
  return (
    <div className="p-4 bg-black/20 rounded-lg my-4">
      <h3 className="font-medium text-siso-text-bold mb-2">Your Learning Progress</h3>
      <div className="h-2 bg-siso-text/10 rounded-full">
        <div className="h-full bg-siso-orange rounded-full w-1/3"></div>
      </div>
      <p className="text-sm text-siso-text/70 mt-2">33% Complete</p>
    </div>
  );
};

export default LearningProgress;
