
import React from 'react';

// Temporary stub component until the actual component is implemented
export const VideoCategories = () => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {['Beginner', 'Advanced', 'Marketing', 'Development', 'Design'].map((category) => (
          <button key={category} className="px-4 py-2 rounded-full bg-muted text-sm">
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
