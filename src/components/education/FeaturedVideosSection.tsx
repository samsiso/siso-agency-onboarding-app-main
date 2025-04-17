
import React from 'react';

export const FeaturedVideosSection = () => {
  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold text-siso-text-bold mb-4">Featured Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black/20 rounded-lg p-4">
            <div className="aspect-video bg-siso-text/10 rounded-md mb-2"></div>
            <h3 className="font-medium text-siso-text-bold">Video Title {i}</h3>
            <p className="text-sm text-siso-text/70">Sample description</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedVideosSection;
