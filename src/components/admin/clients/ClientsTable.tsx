import { useRef } from 'react';
import { ClientViewPreference } from '@/types/client.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientAddForm } from './ClientAddForm';
import { ClientAnalyticsCards } from './ClientAnalyticsCards';
import { ClientsHeader } from './ClientsHeader';
import { ClientDetailSheet } from './ClientDetailSheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Download, Trash2, Users } from 'lucide-react';
import { DraggableColumnHeader } from './DraggableColumnHeader';
import { ScrollableTable } from './ScrollableTable';
import { useClientTable } from './hooks/useClientTable';
import { useClientAnalytics } from './components/ClientAnalytics';
import { ClientTableCell, TableCell } from './components/ClientTableCell';
import { cn } from "@/lib/utils";
import { tableStyles, tableRowStyles } from '@/components/ui/table-styles';
import * as React from 'react';

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
      
      <div ref={tableContainerRef} className="relative rounded-lg overflow-hidden border border-border/30 bg-card/30 shadow-sm backdrop-blur-sm">
        <ScrollableTable pinnedColumns={pinnedColumns}>
          <Table ref={tableElementRef} className={cn(
            tableStyles(),
            "backdrop-blur-sm [&_th]:bg-background/95 [&_td]:bg-transparent"
          )}>
            <TableHeader className="sticky top-0 z-20">
              <TableRow className="hover:bg-transparent border-border/30">
                <TableHead className="w-12 bg-card/95 backdrop-blur-sm sticky left-0 z-30">
                  <Checkbox 
                    checked={selectedClients.length === clients.length && clients.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all clients"
                    className={selectedClients.length > 0 && selectedClients.length < clients.length ? "opacity-80" : ""}
                  />
                </TableHead>
                
                {visibleColumns.map((column, index) => {
                  const isPinned = !!column.pinned;
                  let leftPosition = 40;
                  if (isPinned) {
                    for (let i = 0; i < index; i++) {
                      if (visibleColumns[i].pinned) {
                        leftPosition += visibleColumns[i].width || 150;
                      }
                    }
                  }
                  
                  return (
                    <TableHead 
                      key={column.key}
                      className={cn(
                        "text-xs font-medium text-muted-foreground tracking-wider uppercase",
                        isPinned ? 'sticky z-20 bg-card/95 backdrop-blur-sm' : ''
                      )}
                      style={{ 
                        minWidth: `${column.width || 150}px`,
                        width: `${column.width || 150}px`,
                        left: isPinned ? `${leftPosition}px` : undefined
                      }}
                    >
                      <DraggableColumnHeader
                        column={column}
                        index={index}
                        onSort={() => handleSort(column.key)}
                        isSorted={viewPreference.sortColumn === column.key}
                        sortDirection={viewPreference.sortDirection}
                      />
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={visibleColumns.length + 1} 
                    className="h-[300px] text-center bg-background/30"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-50" />
                      <p className="text-sm">No clients found matching your search criteria</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          if (onSearchChange) onSearchChange('');
                          if (onStatusFilterChange) onStatusFilterChange('all');
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className={cn(
                      tableRowStyles(),
                      "group transition-all duration-200"
                    )}
                  >
                    <TableCell className="sticky left-0 bg-background z-10">
                      <Checkbox 
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleSelectClient(client.id)}
                        aria-label={`Select ${client.full_name}`}
                      />
                    </TableCell>
                    
                    {visibleColumns.map((column, colIndex) => {
                      const isPinned = !!column.pinned;
                      let leftPosition = 40;
                      if (isPinned) {
                        for (let i = 0; i < colIndex; i++) {
                          if (visibleColumns[i].pinned) {
                            leftPosition += visibleColumns[i].width || 150;
                          }
                        }
                      }
                      
                      const isEditing = editingCell?.id === client.id && editingCell?.field === column.key;
                      
                      return (
                        <TableCell 
                          key={column.key}
                          isPinned={isPinned}
                          leftPosition={leftPosition}
                          style={{ maxWidth: `${column.width || 150}px` }}
                        >
                          <ClientTableCell
                            client={client}
                            columnKey={column.key}
                            isEditing={isEditing}
                            editValue={editValue}
                            editInputRef={editInputRef}
                            onEditValueChange={setEditValue}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && editingCell) {
                                handleSaveEdit({
                                  id: editingCell.id,
                                  field: editingCell.field,
                                  value: editValue
                                });
                              }
                            }}
                            onDoubleClick={() => handleStartEdit(client, column.key)}
                            onSaveEdit={handleSaveEdit}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollableTable>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(pageNum => 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= page - 1 && pageNum <= page + 1)
                )
                .map((pageNum, i, array) => {
                  if (i > 0 && array[i - 1] !== pageNum - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${pageNum}`}>
                        <PaginationItem>
                          <span className="px-2">...</span>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNum);
                            }}
                            isActive={page === pageNum}
                            className={page === pageNum ? "bg-primary hover:bg-primary/90" : "hover:bg-muted/50"}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                        isActive={page === pageNum}
                        className={page === pageNum ? "bg-primary hover:bg-primary/90" : "hover:bg-muted/50"}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
