
import React from 'react';
import { cn } from '@/lib/utils';

interface BasicCellProps {
  value: string | number | null | undefined;
  className?: string;
}

export const BasicCell = ({ value, className }: BasicCellProps) => {
  if (value === null || value === undefined) {
    return <span>-</span>;
  }
  
  return (
    <span className={cn("truncate", className)}>
      {String(value)}
    </span>
  );
};
