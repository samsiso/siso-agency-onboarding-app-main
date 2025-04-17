
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const VideoBreadcrumbs = ({ title }: { title?: string }) => {
  return (
    <div className="flex items-center text-sm text-siso-text/70 mb-4">
      <Link to="/education" className="hover:text-siso-text-bold">Education</Link>
      <ChevronRight className="h-4 w-4 mx-1" />
      <Link to="/education/videos" className="hover:text-siso-text-bold">Videos</Link>
      {title && (
        <>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-siso-text-bold truncate max-w-xs">{title}</span>
        </>
      )}
    </div>
  );
};

export default VideoBreadcrumbs;
