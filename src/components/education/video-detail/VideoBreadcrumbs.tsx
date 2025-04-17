
import React from 'react';
import { Link } from 'react-router-dom';

// Temporary stub component until the actual component is implemented
export const VideoBreadcrumbs = ({ 
  category,
  title
}: { 
  category?: string;
  title?: string;
}) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground mb-4">
      <Link to="/education" className="hover:text-foreground">Education</Link>
      <span className="mx-2">/</span>
      {category && (
        <>
          <Link to={`/education/category/${category}`} className="hover:text-foreground">
            {category}
          </Link>
          <span className="mx-2">/</span>
        </>
      )}
      <span className="text-foreground truncate">{title || "Video Title"}</span>
    </div>
  );
};
