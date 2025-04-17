
import React, { useRef } from 'react';
import { Table } from '@/components/ui/table';
import { ClientViewPreference } from '@/types/client.types';
import { ClientAddForm } from './ClientAddForm';
import { ClientAnalyticsCards } from './ClientAnalyticsCards';
import { ClientsHeader } from './ClientsHeader';
import { ClientDetailSheet } from './ClientDetailSheet';
import { ScrollableTable } from './ScrollableTable';
import { useClientTable } from './hooks/useClientTable';
import { useClientAnalytics } from './components/ClientAnalytics';
import { ClientTableHeader } from './components/ClientTableHeader';
import { ClientTableBody } from './components/ClientTableBody';
import { ClientTablePagination } from './components/ClientTablePagination';
import { cn } from "@/lib/utils";
import { tableStyles } from '@/components/ui/table-styles';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Users } from "lucide-react";

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
    activeClient,
    setActiveClient,
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
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg opacity-70" />
          ))}
        </div>
        
        <Skeleton className="h-14 w-full mb-6 rounded-lg opacity-70" />
        
        <div className="rounded-md border bg-card/30 border-border/50">
          <div className="h-12 border-b border-border/50 flex items-center px-4 py-2">
            <Skeleton className="h-5 w-5 rounded-md opacity-70" />
            <Skeleton className="h-5 w-32 ml-4 rounded-md opacity-70" />
          </div>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="border-b border-border/50 px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-5 rounded-md opacity-70" />
                <div>
                  <Skeleton className="h-5 w-36 mb-2 rounded-md opacity-70" />
                  <Skeleton className="h-4 w-24 rounded-md opacity-70" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full opacity-70" />
            </div>
          ))}
        </div>
      </div>
    );
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
        <div className="flex items-center gap-2 mb-4 py-2.5 px-4 rounded-lg bg-card/30 border border-border/50 shadow-sm backdrop-blur-sm">
          <span className="text-sm font-medium text-muted-foreground">
            {selectedClients.length} clients selected
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteSelected} 
            className="border-border/50 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-border/50 text-muted-foreground hover:bg-muted/50"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
        </div>
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

      {activeClient && (
        <ClientDetailSheet 
          clientId={activeClient} 
          isOpen={!!activeClient} 
          onClose={() => setActiveClient(null)} 
        />
      )}
      
      <ClientAddForm 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen} 
        onSuccess={handleClientAddSuccess}
      />
    </div>
  );
}
