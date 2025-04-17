
import React from 'react';

interface VideoDetailLayoutProps {
  children: React.ReactNode;
}

export const VideoDetailLayout = ({ children }: VideoDetailLayoutProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-black/20 border border-siso-text/10 rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default VideoDetailLayout;
