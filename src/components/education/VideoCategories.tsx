
import React from 'react';

export const VideoCategories = () => {
  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold text-siso-text-bold mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {['Beginner', 'Intermediate', 'Advanced', 'Tutorial', 'Case Study'].map((category) => (
          <div key={category} className="px-3 py-1 bg-siso-text/5 rounded-full text-sm text-siso-text-bold">
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCategories;
