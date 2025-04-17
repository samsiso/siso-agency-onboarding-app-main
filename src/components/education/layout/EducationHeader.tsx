
import React from 'react';

// Define proper interface for component props
interface EducationHeaderProps {
  title?: string;
  description?: string;
  stats?: any;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  isSearchFocused?: boolean;
  onSearchFocus?: () => void;
  onSearchBlur?: () => void;
}

export const EducationHeader: React.FC<EducationHeaderProps> = ({
  title,
  description,
  stats,
  searchQuery,
  onSearchChange,
  isSearchFocused,
  onSearchFocus,
  onSearchBlur
}) => {
  return (
    <div className="pb-4 mb-6 border-b">
      <h2 className="text-2xl font-bold">{title || "Education Hub"}</h2>
      <p className="text-muted-foreground">
        {description || "Learn and grow with our educational resources."}
      </p>
    </div>
  );
};
