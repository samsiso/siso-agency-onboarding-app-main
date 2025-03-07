import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
export interface NewsSearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
export function NewsSearchSection({
  searchQuery,
  onSearchChange
}: NewsSearchSectionProps) {
  return <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
    </div>;
}