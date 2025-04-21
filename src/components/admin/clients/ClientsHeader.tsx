
import React, { useState } from 'react';
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
  ViewColumns
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
    <div className="flex flex-col sm:flex-row gap-4 justify-between flex-wrap bg-card/30 p-4 rounded-lg border border-border/30 backdrop-blur-sm shadow-sm">
      <div className="flex flex-1 gap-2 min-w-[300px]">
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
          <SelectTrigger className="w-36 border-border/50 bg-card/50 shadow-sm">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card/80 backdrop-blur-sm shadow-md border-border/50">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 flex-shrink-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 border-border/50 bg-card/50 shadow-sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        {viewPreference && onViewPreferenceChange && (
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-border/50 bg-card/50 shadow-sm"
            onClick={() => {
              // This would open column customization modal in a real implementation
              console.log("Open column customization");
            }}
          >
            <ViewColumns className="h-4 w-4 mr-2" />
            Columns
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 border-border/50 bg-card/50 shadow-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 border-border/50 bg-card/50 shadow-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        
        <Button 
          className="bg-primary hover:bg-primary/90 shadow-sm"
          onClick={onAddClient}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>
    </div>
  );
}
