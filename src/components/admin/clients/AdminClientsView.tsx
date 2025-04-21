import { useState } from 'react';
import { ClientsHeader } from './ClientsHeader';
import { ClientsEnhancedTable } from './ClientsEnhancedTable';  // Corrected import
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { ClientsCardGrid } from './ClientsCardGrid';
import { ClientViewPreference } from '@/types/client.types';
import { useLocalStorage } from '@/hooks/useLocalStorage';  // Assuming this hook exists

// Default view preference
const defaultViewPreference: ClientViewPreference = {
  columns: [
    { key: 'full_name', label: 'Name', visible: true, width: 180, pinned: true },
    { key: 'email', label: 'Email', visible: true, width: 220 },
    { key: 'business_name', label: 'Business', visible: true, width: 180 },
    { key: 'status', label: 'Status', visible: true, width: 120, pinned: true },
    { key: 'project_name', label: 'Project', visible: true, width: 180 },
    { key: 'estimated_price', label: 'Balance', visible: true, width: 120 },
    { key: 'development_url', label: 'Website', visible: false, width: 150 },
    { key: 'next_steps', label: 'Next Steps', visible: false, width: 200 },
    { key: 'key_research', label: 'Key Research', visible: false, width: 180 },
    { key: 'updated_at', label: 'Updated', visible: true, width: 150 },
    { key: 'start_date', label: 'Start Date', visible: false, width: 150 },
    { key: 'estimated_completion_date', label: 'Est. Completion', visible: false, width: 150 },
  ],
  sortColumn: 'updated_at',
  sortDirection: 'desc',
  pageSize: 20,
  showAllColumns: false,
};

interface AdminClientsViewProps {
  isAdmin: boolean;
}

export function AdminClientsView({ isAdmin }: AdminClientsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewPreference, setViewPreference] = useLocalStorage<ClientViewPreference>(
    'client_view_preference',
    defaultViewPreference
  );
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Update preference handler
  const handleViewPreferenceChange = (updates: Partial<ClientViewPreference>) => {
    setViewPreference({ ...viewPreference, ...updates });
  };

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Status filter handler
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients Dashboard</h1>
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      
      <ClientsHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />
      
      {viewMode === "table" ? (
        <ClientsEnhancedTable 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={handleSearch}
          onStatusFilterChange={handleStatusFilterChange}
        />
      ) : (
        <ClientsCardGrid 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          sortColumn={viewPreference.sortColumn}
          sortDirection={viewPreference.sortDirection}
        />
      )}
    </div>
  );
}
