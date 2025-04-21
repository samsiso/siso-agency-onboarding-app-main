
import React from 'react';
import { ClientsTable } from './ClientsTable';
import { ClientViewPreferenceProvider } from './providers/ClientViewPreferenceProvider';
import { useViewPreference } from './context/ViewPreferenceContext';

interface ClientsEnhancedTableProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (status: string) => void;
}

function ClientsTableContent({ 
  searchQuery, 
  statusFilter,
  onSearchChange,
  onStatusFilterChange 
}: ClientsEnhancedTableProps) {
  const { viewPreference, handleViewPreferenceChange } = useViewPreference();

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

export function ClientsEnhancedTable(props: ClientsEnhancedTableProps) {
  return (
    <ClientViewPreferenceProvider>
      <ClientsTableContent {...props} />
    </ClientViewPreferenceProvider>
  );
}
