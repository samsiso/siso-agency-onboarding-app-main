
import { useState, useMemo } from 'react';
import { ClientsHeader } from './ClientsHeader';
import { ClientsEnhancedTable } from './ClientsEnhancedTable';
import { ViewModeSwitcher } from './ViewModeSwitcher';
import { ClientsCardGrid } from './ClientsCardGrid';
import { ClientViewPreference } from '@/types/client.types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useClientsList } from '@/hooks/client';

import { DashboardStats } from './DashboardStats';
import { PriorityListing } from './PriorityListing';

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

  // Create adapter function to bridge the type mismatch
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
    <div className="container mx-auto p-4 space-y-6">
      {/* Dashboard Icon and Heading */}
      <div className="flex items-center gap-4 mb-2">
        <div className="rounded-full bg-gradient-to-tr from-blue-400/60 to-blue-800/50 p-3 flex items-center justify-center shadow">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.7" y="2.7" width="18.6" height="18.6" rx="3" fill="#403E43" />
            <path d="M7.2,13.2V7.8A.6.6,0,0,1,7.8,7.2h4.4a.6.6,0,0,1,.6.6v5.4Z" fill="#fff"/>
            <circle cx="17.1" cy="16.8" r="1.5" fill="#D946EF"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Clients Dashboard</h1>
      </div>
      {/* Stats Cards */}
      <DashboardStats
        totalClients={statsTotalClients}
        totalProjectValue={statsProjectValue}
      />

      {/* Priority Listing */}
      <div>
        <PriorityListing limit={3} />
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Card: Search & Filter */}
        <div className="bg-card/30 border border-border/40 rounded-xl shadow-sm p-5 transition hover:shadow-lg">
          <ClientsHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            viewPreference={viewPreference}
            onViewPreferenceChange={handleViewPreferenceChange}
            onAddClient={() => setViewMode("table")} // Reuse add client action
            totalClients={statsTotalClients}
            clients={clients}
          />
        </div>
        {/* Card: View Mode Switcher */}
        <div className="bg-card/30 border border-border/40 rounded-xl shadow-sm p-5 flex flex-col items-center justify-center min-h-[140px] transition hover:shadow-lg">
          <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
          <div className="mt-4 text-muted-foreground text-sm">Switch between Table and Card views</div>
        </div>
      </div>

      {/* Main Content */}
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
