import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DirectoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const DirectoryFilters = ({ searchQuery, onSearchChange }: DirectoryFiltersProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-siso-text/50 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search educators..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};