
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewOptionsMenu } from './ViewOptionsMenu';
import { ColumnManager } from './ColumnManager';
import { ClientData, ClientViewPreference } from '@/types/client.types';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  UserPlus, 
  Download, 
  Upload,
  Save,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SavedViewsManager } from './SavedViewsManager';
import { ImportExportTools } from './ImportExportTools';

interface ClientsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
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
  const [isAdvancedFiltersVisible, setIsAdvancedFiltersVisible] = useState(false);
  const [currentViewName, setCurrentViewName] = useState('');
  const [isSavingView, setIsSavingView] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Client Management</h1>
          <Badge variant="outline" className="ml-2">{totalClients} clients</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAddClient} variant="default">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
          
          <SavedViewsManager 
            currentView={viewPreference}
            onViewChange={(preference) => onViewPreferenceChange(preference)}
          />
          
          <ImportExportTools 
            clients={clients}
            onImportComplete={onRefetch}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, project..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <ColumnManager 
            columns={viewPreference.columns} 
            onColumnsChange={(columns) => onViewPreferenceChange({ columns })}
          />
          
          <ViewOptionsMenu
            viewPreference={viewPreference}
            onViewPreferenceChange={onViewPreferenceChange}
          />
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setIsAdvancedFiltersVisible(!isAdvancedFiltersVisible)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {isAdvancedFiltersVisible && (
        <div className="p-4 border rounded-md bg-card">
          <h3 className="font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Advanced filters go here */}
          </div>
        </div>
      )}
    </div>
  );
}
