
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
  RefreshCw, 
  Users, 
  PanelLeftOpen, 
  PanelRightOpen, 
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
    <div className="space-y-6">
      {/* Title and main actions */}
      <div className="flex justify-between items-center p-1">
        <div className="flex items-center space-x-4">
          <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center shadow-sm">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Clients
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalClients} total clients in your database
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 shadow-sm hover:bg-muted/50 border-border/50" 
            onClick={() => onRefetch()}
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 shadow-sm hover:bg-muted/50 border-border/50" 
            onClick={handleToggleShowAllColumns}
            title={viewPreference.showAllColumns ? "Show only selected columns" : "Show all columns"}
          >
            {viewPreference.showAllColumns ? (
              <><PanelLeftOpen className="h-4 w-4 mr-2" /> Focus View</>
            ) : (
              <><PanelRightOpen className="h-4 w-4 mr-2" /> Expanded View</>
            )}
          </Button>
          <ImportExportTools 
            clients={clients} 
            onImportComplete={onRefetch} 
          />
          <Button className="bg-primary hover:bg-primary/90 shadow-md" onClick={onAddClient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Filters, search and views */}
      <div className="flex flex-wrap gap-4 justify-between items-center bg-muted/30 p-4 rounded-md border border-border/50 shadow-sm">
        <div className="flex flex-1 gap-4 min-w-[280px]">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9 border-border/50 bg-background shadow-sm h-10"
              value={localSearch}
              onChange={handleSearchChange}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] border-border/50 bg-background shadow-sm h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="border-border/70 bg-card/95 backdrop-blur-sm shadow-lg">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-3 items-center">
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
