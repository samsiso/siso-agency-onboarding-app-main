import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PromptListHeaderProps {
  project: string;
  count: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const PromptListHeader: React.FC<PromptListHeaderProps> = ({
  project,
  count,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Prompts for {project} ({count})
        </h2>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}; 