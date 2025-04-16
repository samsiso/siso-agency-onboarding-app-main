
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Download,
  Filter, 
  Plus, 
  Save,
  Search, 
  Settings2, 
  SlidersHorizontal,
  Table,
  Grid
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewOptionsMenu } from './ViewOptionsMenu';
import { ClientViewPreference } from '@/types/client.types';
import { toast } from 'react-hot-toast';

interface ClientsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
}

export function ClientsToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewPreference,
  onViewPreferenceChange
}: ClientsToolbarProps) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [savedViews, setSavedViews] = useState<{name: string, preference: ClientViewPreference}[]>(
    JSON.parse(localStorage.getItem('savedClientViews') || '[]')
  );

  const handleExportData = () => {
    toast.success('Exporting client data...');
    // Implementation would handle data export
    console.log('Exporting data...');
  };

  const handleAddNewClient = () => {
    toast.success('Opening client creation form...');
    // Navigate to client creation form or open a modal
    console.log('Adding new client...');
  };

  const handleSaveCurrentView = () => {
    // Open prompt to name the view
    const viewName = prompt('Enter a name for this view:');
    if (!viewName) return;
    
    const newSavedViews = [
      ...savedViews,
      { name: viewName, preference: viewPreference }
    ];
    
    localStorage.setItem('savedClientViews', JSON.stringify(newSavedViews));
    setSavedViews(newSavedViews);
    toast.success(`View "${viewName}" saved successfully!`);
  };

  const handleLoadView = (view: {name: string, preference: ClientViewPreference}) => {
    onViewPreferenceChange(view.preference);
    toast.success(`Loaded view "${view.name}"`);
  };

  const handleDeleteView = (index: number) => {
    const newSavedViews = [...savedViews];
    const deletedView = newSavedViews[index];
    newSavedViews.splice(index, 1);
    setSavedViews(newSavedViews);
    localStorage.setItem('savedClientViews', JSON.stringify(newSavedViews));
    toast.success(`View "${deletedView.name}" deleted`);
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
    // In a real implementation, this would trigger a change in the view component
    toast.success(`Switched to ${mode} view`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Select 
            value={statusFilter} 
            onValueChange={onStatusFilterChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}>
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ViewOptionsMenu 
            viewPreference={viewPreference}
            onViewPreferenceChange={onViewPreferenceChange}
          />

          <div className="border rounded-md flex">
            <Button 
              variant={viewMode === 'table' ? 'default' : 'ghost'} 
              size="icon"
              className="rounded-r-none"
              onClick={() => handleViewModeChange('table')}
            >
              <Table className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="icon"
              className="rounded-l-none"
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Views
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSaveCurrentView}>
                <Save className="mr-2 h-4 w-4" />
                Save Current View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {savedViews.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No saved views
                </div>
              ) : (
                savedViews.map((view, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    onClick={() => handleLoadView(view)}
                    className="flex justify-between"
                  >
                    <span>{view.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteView(index);
                      }}
                      className="ml-2 text-destructive hover:text-destructive/80"
                    >
                      &times;
                    </button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleAddNewClient}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {isAdvancedFiltersOpen && (
        <div className="bg-card border rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Payment Status</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Project Status</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="review">Under Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Join Date</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
