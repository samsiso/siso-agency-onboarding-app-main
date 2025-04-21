import React from 'react';
import { ClientsTable } from './ClientsTable';
import { useClientTable } from './hooks/useClientTable';
import { ClientViewPreference } from '@/types/client.types';
import { 
  Search,
  Filter,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Columns
} from 'lucide-react';

interface ClientsEnhancedTableProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
}

export function ClientsEnhancedTable({ 
  searchQuery, 
  statusFilter,
  onSearchChange,
  onStatusFilterChange 
}: ClientsEnhancedTableProps) {
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

  const [viewPreference, setViewPreference] = React.useState<ClientViewPreference>(defaultViewPreference);

  // Update preference handler
  const handleViewPreferenceChange = (updates: Partial<ClientViewPreference>) => {
    setViewPreference({ ...viewPreference, ...updates });
  };

  return (
    <ClientsTable
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      viewPreference={viewPreference}
      onViewPreferenceChange={handleViewPreferenceChange}
      onSearchChange={onSearchChange}
      onStatusFilterChange={onStatusFilterChange}
    />
  );
}
