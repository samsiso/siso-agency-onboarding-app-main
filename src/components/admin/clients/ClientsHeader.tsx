
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ColumnManager } from './ColumnManager';
import { ViewOptionsMenu } from './ViewOptionsMenu';
import { SavedViewsManager } from './SavedViewsManager';
import { ClientViewPreference, ClientData } from '@/types/client.types';
import { ImportExportTools } from './ImportExportTools';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Users, 
  PanelLeftOpen, 
  PanelRightOpen, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface ClientsHeaderProps {
  searchQuery: string;
  onSearchChange?: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange?: (value: string) => void;
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
  onAddClient: () => void;
  totalClients: number;
  clients: ClientData[];
  onRefetch: () => void;
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
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleStatusChange = (value: string) => {
    if (onStatusFilterChange) {
      onStatusFilterChange(value);
    }
  };
  
  const handleToggleShowAllColumns = () => {
    const newShowAllState = !viewPreference.showAllColumns;
    
    // Toggle visibility of all columns
    const updatedColumns = viewPreference.columns.map(col => ({
      ...col,
      visible: newShowAllState || (col.key === 'full_name' || col.key === 'status')
    }));
    
    onViewPreferenceChange({ 
      columns: updatedColumns,
      showAllColumns: newShowAllState
    });
  };

  return (
    <div className="space-y-4">
      {/* Title and main actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">
            Clients
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {totalClients} total
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9" 
            onClick={() => onRefetch()}
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9" 
            onClick={handleToggleShowAllColumns}
            title={viewPreference.showAllColumns ? "Show only selected columns" : "Show all columns"}
          >
            {viewPreference.showAllColumns ? (
              <><PanelLeftOpen className="h-4 w-4 mr-1" /> Focus</>
            ) : (
              <><PanelRightOpen className="h-4 w-4 mr-1" /> Expand</>
            )}
          </Button>
          <ImportExportTools clients={clients} onImportComplete={onRefetch} />
          <Button className="bg-primary" onClick={onAddClient}>
            <Plus className="h-4 w-4 mr-1" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Filters, search and views */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-1 gap-4 min-w-[280px]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-8"
              value={localSearch}
              onChange={handleSearchChange}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 items-center">
          <ColumnManager 
            columns={viewPreference.columns}
            onColumnsChange={(columns) => onViewPreferenceChange({ columns })}
            showAllColumns={viewPreference.showAllColumns}
            onToggleShowAll={handleToggleShowAllColumns}
          />
          
          <Separator orientation="vertical" className="h-8" />
          
          <ViewOptionsMenu 
            pageSize={viewPreference.pageSize}
            onPageSizeChange={(pageSize) => onViewPreferenceChange({ pageSize })}
          />
          
          <SavedViewsManager
            currentPreference={viewPreference}
            onLoadView={(preference) => onViewPreferenceChange(preference)}
          />
        </div>
      </div>
    </div>
  );
}
