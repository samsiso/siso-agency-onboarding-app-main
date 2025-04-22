
import React, { useRef } from 'react';
import { Table } from '@/components/ui/table';
import { ClientViewPreference } from '@/types/client.types';
import { ClientAddForm } from './ClientAddForm';
// import { ClientAnalyticsCards } from './ClientAnalyticsCards'; // Removed import of analytics cards to avoid unused import warning
// import { ClientsHeader } from './ClientsHeader'; // Removed duplicate header rendering!
import { ScrollableTable } from './ScrollableTable';
import { useClientTable } from './hooks/useClientTable';
// Removed import of clientAnalytics hook since analytics cards are removed
import { ClientTableHeader } from './components/ClientTableHeader';
import { ClientTableBody } from './components/ClientTableBody';
import { ClientTablePagination } from './components/ClientTablePagination';
import { cn } from "@/lib/utils";
import { tableStyles } from '@/components/ui/table-styles';
import { BulkActionsBar } from './BulkActionsBar';
import { ClientsTableSkeleton } from './ClientsTableSkeleton';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ClientsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
  viewMode?: "table" | "cards";
  setViewMode?: (mode: "table" | "cards") => void;
}

export function ClientsTable({ 
  searchQuery = '', 
  statusFilter = 'all',
  viewPreference,
  onViewPreferenceChange,
  onSearchChange,
  onStatusFilterChange,
  viewMode,
  setViewMode
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
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {/* Removed <ClientsHeader /> - no duplicate bar! */}
        {selectedClients.length > 0 && (
          <BulkActionsBar
            selectedCount={selectedClients.length}
            onDeleteSelected={handleDeleteSelected}
            onExportSelected={() => {
              // Placeholder for export logic
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
    </DndProvider>
  );
}

