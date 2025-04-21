
import React, { useRef } from 'react';
import { Table } from '@/components/ui/table';
import { ClientViewPreference } from '@/types/client.types';
import { ClientAddForm } from './ClientAddForm';
import { ClientAnalyticsCards } from './ClientAnalyticsCards';
import { ClientsHeader } from './ClientsHeader';
import { ScrollableTable } from './ScrollableTable';
import { useClientTable } from './hooks/useClientTable';
import { useClientAnalytics } from './components/ClientAnalytics';
import { ClientTableHeader } from './components/ClientTableHeader';
import { ClientTableBody } from './components/ClientTableBody';
import { ClientTablePagination } from './components/ClientTablePagination';
import { cn } from "@/lib/utils";
import { tableStyles } from '@/components/ui/table-styles';
// NEW: Import extracted small components:
import { BulkActionsBar } from './BulkActionsBar';
import { ClientsTableSkeleton } from './ClientsTableSkeleton';

interface ClientsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

export function ClientsTable({ 
  searchQuery = '', 
  statusFilter = 'all',
  viewPreference,
  onViewPreferenceChange,
  onSearchChange,
  onStatusFilterChange
}: ClientsTableProps) {
  const [isAddClientOpen, setIsAddClientOpen] = React.useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const tableElementRef = useRef<HTMLTableElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const {
    page,
    setPage,
    selectedClients,
    editingCell,
    editValue,
    setEditValue,
    editInputRef,
    clients,
    isLoading,
    totalCount,
    handleSort,
    handleSelectAll,
    handleSelectClient,
    handleStartEdit,
    handleSaveEdit,
    handleDeleteSelected,
    refetch
  } = useClientTable(searchQuery, statusFilter, viewPreference, onViewPreferenceChange);

  const analyticsData = useClientAnalytics({ clients, totalCount });
  
  const visibleColumns = React.useMemo(() => 
    viewPreference.columns.filter(col => col.visible),
    [viewPreference.columns]
  );

  const pinnedColumns = React.useMemo(() => 
    visibleColumns.filter(col => col.pinned),
    [visibleColumns]
  );

  const totalPages = Math.ceil(totalCount / viewPreference.pageSize);

  const handleClientAddSuccess = () => {
    refetch();
  };

  const moveColumn = React.useCallback((dragIndex: number, hoverIndex: number) => {
    onViewPreferenceChange({
      columns: Array.from(viewPreference.columns, (col, idx) => {
        if (idx === dragIndex) {
          return viewPreference.columns[hoverIndex];
        }
        if (idx === hoverIndex) {
          return viewPreference.columns[dragIndex];
        }
        return col;
      }),
    });
  }, [viewPreference.columns, onViewPreferenceChange]);

  if (isLoading) {
    return <ClientsTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ClientAnalyticsCards {...analyticsData} />
      
      <ClientsHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        viewPreference={viewPreference}
        onViewPreferenceChange={onViewPreferenceChange}
        onAddClient={() => setIsAddClientOpen(true)}
        totalClients={totalCount}
        clients={clients}
        onRefetch={refetch}
      />
      
      {selectedClients.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedClients.length}
          onDeleteSelected={handleDeleteSelected}
          onExportSelected={() => {
            // Placeholder for export logic
            // You may later want to wire up actual export functionality
          }}
        />
      )}
      
      <div ref={tableContainerRef} className="relative rounded-lg overflow-hidden border border-border/30 bg-background/30 shadow-sm backdrop-blur-sm">
        <ScrollableTable pinnedColumns={pinnedColumns}>
          <Table ref={tableElementRef} className={cn(
            tableStyles(),
            "backdrop-blur-sm [&_th]:bg-background/95 [&_td]:bg-transparent"
          )}>
            <ClientTableHeader
              visibleColumns={visibleColumns}
              selectedClients={selectedClients}
              clients={clients}
              onSelectAll={handleSelectAll}
              onSort={handleSort}
              sortColumn={viewPreference.sortColumn}
              sortDirection={viewPreference.sortDirection}
              moveColumn={moveColumn}
            />
            <ClientTableBody
              clients={clients}
              visibleColumns={visibleColumns}
              selectedClients={selectedClients}
              editingCell={editingCell}
              editValue={editValue}
              editInputRef={editInputRef}
              onEditValueChange={setEditValue}
              onSelectClient={handleSelectClient}
              onStartEdit={handleStartEdit}
              onSaveEdit={handleSaveEdit}
            />
          </Table>
        </ScrollableTable>
      </div>

      <ClientTablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <ClientAddForm 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen} 
        onSuccess={handleClientAddSuccess}
      />
    </div>
  );
}
