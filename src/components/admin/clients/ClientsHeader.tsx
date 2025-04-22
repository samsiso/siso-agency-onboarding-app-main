import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Plus,
  Download,
  Upload,
  RefreshCw,
  Columns // Replaced ViewColumns with Columns which is a valid lucide-react icon
} from 'lucide-react';
import { ClientViewPreference, ClientData } from '@/types/client.types';
import { RefetchOptions } from '@tanstack/react-query';

interface ClientsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewPreference?: ClientViewPreference;
  onViewPreferenceChange?: (preference: Partial<ClientViewPreference>) => void;
  onAddClient?: () => void;
  totalClients?: number;
  clients?: ClientData[];
  onRefetch?: (options?: RefetchOptions) => Promise<unknown>;
}

export function ClientsHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewPreference,
  onViewPreferenceChange,
  onAddClient,
  totalClients,
  clients,
  onRefetch
}: ClientsHeaderProps) {
  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  // Handle status filter changes
  const handleStatusChange = (value: string) => {
    onStatusFilterChange(value);
  };

  // Handle refresh click
  const handleRefresh = () => {
    if (onRefetch) {
      onRefetch();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="pl-9 border-border/50 bg-card/50 shadow-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40 border-border/50 bg-card/50 shadow-sm">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-background/90 text-foreground shadow-lg border-border/50 z-50">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        {viewPreference && onViewPreferenceChange && (
          <Button
            variant="outline"
            size="icon"
            className="ml-2"
            onClick={() => {
              console.log("Open column customization");
            }}
            title="Columns"
          >
            <Columns className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={onAddClient}
          title="Add Client"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {/* Optionally: You can add more controls here */}
    </div>
  );
}
