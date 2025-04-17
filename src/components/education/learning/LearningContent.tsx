
import React from 'react';

export const LearningContent = () => {
  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold text-siso-text-bold mb-4">Learning Content</h2>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-black/20 border border-siso-text/10 rounded-lg">
            <h3 className="font-medium text-siso-text-bold">Module {i}</h3>
            <p className="text-sm text-siso-text/70 mt-1">This is a description of the module content.</p>
            <div className="mt-3 flex justify-end">
              <button className="px-3 py-1 text-sm bg-siso-text/10 hover:bg-siso-text/20 rounded-md text-siso-text-bold">
                Start Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningContent;
