
import { useState, useMemo } from 'react';
import { ClientsEnhancedTable } from './ClientsEnhancedTable';
import { ClientsCardGrid } from './ClientsCardGrid';
import { ClientViewPreference } from '@/types/client.types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useClientsList } from '@/hooks/client';
import { DashboardStats } from './DashboardStats';
import { PriorityListing } from './PriorityListing';
import { ClientsControlsBar } from './ClientsControlsBar';

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

  // Stats - fetch ONE query for total clients & total financials
  const { clients = [], isLoading } = useClientsList({
    searchQuery,
    statusFilter,
    sortColumn: viewPreference.sortColumn,
    sortDirection: viewPreference.sortDirection,
    pageSize: 1000,
  });
  const statsTotalClients = clients.length;
  const statsProjectValue = useMemo(
    () => clients.reduce((acc, curr) => acc + (curr.estimated_price || 0), 0),
    [clients]
  );

  // Adapter for view preference
  const handleViewPreferenceChange = (updates: Partial<ClientViewPreference>) => {
    setViewPreference(prev => ({ ...prev, ...updates }));
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
    <div className="space-y-6">
      {/* Dashboard stats */}
      <DashboardStats
        totalClients={statsTotalClients}
        totalProjectValue={statsProjectValue}
      />
      {/* Priority Clients */}
      <PriorityListing limit={3} />
      {/* Controls Bar (search/filter/view mode) */}
      <ClientsControlsBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {/* Main Content Area */}
      <div>
        {viewMode === "table" ? (
          <ClientsEnhancedTable 
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusFilterChange={setStatusFilter}
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
    </div>
  );
}
