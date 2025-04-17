
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
import { ClientViewPreference } from '@/types/client.types';
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

interface ClientsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
  onAddClient: () => void;
  totalClients: number;
}

export function ClientsHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewPreference,
  onViewPreferenceChange,
  onAddClient,
  totalClients
}: ClientsHeaderProps) {
  const [isAdvancedFiltersVisible, setIsAdvancedFiltersVisible] = useState(false);
  const [savedViews, setSavedViews] = useState<{id: string, name: string}[]>([
    { id: 'default', name: 'Default View' },
    { id: 'financial', name: 'Financial Focus' },
    { id: 'upcoming', name: 'Upcoming Deadlines' }
  ]);
  const [currentViewName, setCurrentViewName] = useState('');
  const [isSavingView, setIsSavingView] = useState(false);

  const handleSaveCurrentView = () => {
    if (!currentViewName) return;
    
    const newView = { 
      id: `view-${Date.now()}`, 
      name: currentViewName 
    };
    
    setSavedViews([...savedViews, newView]);
    setCurrentViewName('');
    setIsSavingView(false);
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Views
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {savedViews.map(view => (
                <DropdownMenuItem key={view.id} className="cursor-pointer">
                  {view.name}
                  {view.id === 'default' && <Check className="ml-auto h-4 w-4 text-green-500" />}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              {isSavingView ? (
                <div className="p-2 flex items-center gap-2">
                  <Input 
                    placeholder="View name" 
                    value={currentViewName}
                    onChange={(e) => setCurrentViewName(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0" 
                    onClick={handleSaveCurrentView}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsSavingView(true);
                  }}
                >
                  Save current view
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, project..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
