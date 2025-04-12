
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PlanSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PlanSearch = ({ searchQuery, setSearchQuery }: PlanSearchProps) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-siso-text/10 rounded-lg p-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text h-4 w-4" />
        <Input
          type="text"
          placeholder="Search plans by company name, username, or app name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-black/20 border-siso-text/20"
        />
      </div>
    </div>
  );
};
