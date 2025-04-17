
import React, { ReactNode } from 'react';

// Temporary stub component until the actual component is implemented
export const VideoDetailLayout = ({ 
  children,
  videoId
}: { 
  children: ReactNode;
  videoId?: string;
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {children}
        </div>
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Related Videos</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="bg-muted w-20 aspect-video rounded"></div>
                  <div>
                    <p className="text-sm font-medium">Related Video {item}</p>
                    <p className="text-xs text-muted-foreground">5 min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
