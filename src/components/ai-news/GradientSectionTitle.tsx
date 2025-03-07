
import React from 'react';
import { cn } from '@/lib/utils';

// [Analysis] Reusable gradient title component for consistent section headers
interface GradientSectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  subtitleClassName?: string;
}

export const GradientSectionTitle = ({
  title,
  subtitle,
  icon,
  className,
  subtitleClassName
}: GradientSectionTitleProps) => {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-blue-400">{icon}</div>}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className={cn("text-gray-400 mt-1", subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
