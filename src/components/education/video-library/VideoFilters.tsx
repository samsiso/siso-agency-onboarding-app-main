import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface VideoFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const VideoFilters = ({ searchQuery, onSearchChange }: VideoFiltersProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-siso-text/50 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button variant="outline">Filters</Button>
    </div>
  );
};