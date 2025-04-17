import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useClientsList } from '@/hooks/client';
import { ClientData, ClientViewPreference, ClientColumnPreference, TodoItem } from '@/types/client.types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientStatusBadge } from './ClientStatusBadge';
import { ClientAnalyticsCards } from './ClientAnalyticsCards';
import { ClientsHeader } from './ClientsHeader';
import { ClientAddForm } from './ClientAddForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatRelativeTime } from '@/lib/formatters';
import { 
  ArrowUpDown, 
  Check,
  ChevronDown, 
  Download,
  Edit2,
  ExternalLink, 
  MoreHorizontal, 
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  FileText,
  Link,
  CalendarClock,
  DollarSign,
  Pin,
  PinOff,
  Users
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientDetailSheet } from './ClientDetailSheet';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TodoList } from './TodoList';
import { DraggableColumnHeader } from './DraggableColumnHeader';
import { ScrollableTable } from './ScrollableTable';
import '../../../components/ui/hide-scrollbar.css';
import { ClientSelectField } from './ClientSelectField';

const COMPANY_NICHE_OPTIONS = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'agency', label: 'Agency' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' }
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' }
];

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
  const [page, setPage] = useState(1);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const tableRef = useRef<HTMLDivElement>(null);
  const tableElementRef = useRef<HTMLTableElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const visibleColumns = useMemo(() => 
    viewPreference.columns.filter(col => col.visible),
    [viewPreference.columns]
  );

  const pinnedColumns = useMemo(() => 
    visibleColumns.filter(col => col.pinned),
    [visibleColumns]
  );

  const { clients, isLoading, totalCount, refetch } = useClientsList({
    page,
    pageSize: viewPreference.pageSize,
    searchQuery,
    statusFilter, 
    sortColumn: viewPreference.sortColumn,
    sortDirection: viewPreference.sortDirection
  });

  const analyticsData = useMemo(() => {
    const activeClientsCount = clients.filter(c => c.status === 'active').length;
    const pipelineClientsCount = clients.filter(c => ['pending', 'proposal', 'negotiation'].includes(c.status)).length;
    const pipelineValue = clients
      .filter(c => ['pending', 'proposal', 'negotiation'].includes(c.status))
      .reduce((sum, client) => sum + (client.estimated_price || 0), 0);
    const conversionRate = totalCount > 0 ? Math.round((activeClientsCount / totalCount) * 100) : 0;

    return {
      activeClients: activeClientsCount,
      pipelineClients: pipelineClientsCount,
      pipelineValue,
      conversionRate
    };
  }, [clients, totalCount]);

  const totalPages = Math.ceil(totalCount / viewPreference.pageSize);

  const handleAddClient = () => {
    setIsAddClientOpen(true);
  };

  const handleClientAddSuccess = () => {
    refetch();
    toast({
      title: "Client added successfully",
      description: "The new client has been added to your list."
    });
  };

  const handleStartEdit = (client: ClientData, field: string) => {
    setEditingCell({ id: client.id, field });
    setEditValue(String(client[field as keyof ClientData] || ''));
    
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  const handleSaveEdit = async ({ id, field, value }: { id: string; field: string; value: string }) => {
    try {
      const { error } = await supabase
        .from('client_onboarding')
        .update({ 
          [field]: value,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Update successful",
        description: `Updated ${field} for this client.`
      });
      
      refetch();
    } catch (error: any) {
      console.error('Error saving edit:', error);
      toast({
        variant: "destructive",
        title: "Error updating client",
        description: error.message || "Failed to save changes. Please try again."
      });
    } finally {
      setEditingCell(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editingCell) {
      handleSaveEdit({
        id: editingCell.id,
        field: editingCell.field,
        value: editValue
      });
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleSort = (column: string) => {
    if (viewPreference.sortColumn === column) {
      onViewPreferenceChange({
        sortDirection: viewPreference.sortDirection === 'asc' ? 'desc' : 'asc'
      });
    } else {
      onViewPreferenceChange({
        sortColumn: column,
        sortDirection: 'asc'
      });
    }
  };

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(client => client.id));
    }
  };

  const handleSelectClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleOpenDetails = (clientId: string) => {
    setActiveClient(clientId);
  };

  const handleCloseDetails = () => {
    setActiveClient(null);
  };

  const handleToggleColumnPin = useCallback((index: number) => {
    const newColumns = [...viewPreference.columns];
    const columnKey = visibleColumns[index].key;
    
    const columnIndex = newColumns.findIndex(col => col.key === columnKey);
    if (columnIndex !== -1) {
      newColumns[columnIndex] = {
        ...newColumns[columnIndex],
        pinned: !newColumns[columnIndex].pinned
      };
      
      onViewPreferenceChange({ columns: newColumns });
    }
  }, [viewPreference.columns, visibleColumns, onViewPreferenceChange]);

  const handleColumnReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragKey = visibleColumns[dragIndex].key;
    const hoverKey = visibleColumns[hoverIndex].key;
    
    const newColumns = [...viewPreference.columns];
    
    const dragFullIndex = newColumns.findIndex(col => col.key === dragKey);
    const hoverFullIndex = newColumns.findIndex(col => col.key === hoverKey);
    
    if (dragFullIndex !== -1 && hoverFullIndex !== -1) {
      const dragItem = newColumns[dragFullIndex];
      newColumns.splice(dragFullIndex, 1);
      newColumns.splice(hoverFullIndex, 0, dragItem);
      
      onViewPreferenceChange({ columns: newColumns });
    }
  }, [visibleColumns, viewPreference.columns, onViewPreferenceChange]);

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      const cell = editInputRef.current.parentElement;
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [editingCell]);

  const handleDeleteSelected = async () => {
    if (selectedClients.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedClients.length} selected clients?`)) {
      try {
        const { error } = await supabase
          .from('client_onboarding')
          .delete()
          .in('id', selectedClients);
        
        if (error) throw error;
        
        toast({
          title: "Clients deleted",
          description: `Successfully deleted ${selectedClients.length} clients.`
        });
        
        setSelectedClients([]);
        refetch();
      } catch (error: any) {
        console.error('Error deleting clients:', error);
        toast({
          variant: "destructive",
          title: "Error deleting clients",
          description: error.message || "Failed to delete selected clients."
        });
      }
    }
  };

  function renderCellContent(client: ClientData, columnKey: string) {
    const isEditing = editingCell?.id === client.id && editingCell?.field === columnKey;

    const handleDoubleClick = () => {
      handleStartEdit(client, columnKey);
    };

    switch (columnKey) {
      case 'full_name':
        return (
          <div className="flex flex-col">
            {isEditing ? (
              <Input
                ref={editInputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="h-8 min-w-[120px] border-border/50"
                autoFocus
              />
            ) : (
              <div onDoubleClick={handleDoubleClick}>
                <span className="font-medium">{client.full_name || 'Unknown'}</span>
                <span className="text-sm text-muted-foreground">{client.email || 'No email'}</span>
              </div>
            )}
          </div>
        );
      case 'status':
        return (
          <ClientSelectField
            value={client.status}
            onChange={(value) => handleSaveEdit({ id: client.id, field: 'status', value })}
            options={STATUS_OPTIONS}
            className="h-8 min-w-[120px]"
          />
        );
      case 'company_niche':
        return (
          <ClientSelectField
            value={client.company_niche || 'other'}
            onChange={(value) => handleSaveEdit({ id: client.id, field: 'company_niche', value })}
            options={COMPANY_NICHE_OPTIONS}
            className="h-8 min-w-[120px]"
          />
        );
      case 'updated_at':
        return formatRelativeTime(client.updated_at);
      case 'notion_plan_url':
        return client.notion_plan_url ? (
          <a 
            href={client.notion_plan_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <FileText className="h-4 w-4 mr-1" />
            Notion Plan
          </a>
        ) : '-';
      case 'estimated_price':
        return client.estimated_price 
          ? <span className="flex items-center"><DollarSign className="h-4 w-4" />{client.estimated_price.toLocaleString()}</span> 
          : '-';
      case 'development_url':
        return client.development_url ? (
          <a 
            href={client.development_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <Link className="h-4 w-4 mr-1" />
            View Site
          </a>
        ) : '-';
      case 'next_steps':
        return (
          <div className="max-w-xs truncate" title={client.next_steps || ''}>
            {isEditing ? (
              <Input
                ref={editInputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="h-8 min-w-[120px] border-border/50"
                autoFocus
              />
            ) : (
              <div onDoubleClick={handleDoubleClick}>
                {client.next_steps || '-'}
              </div>
            )}
          </div>
        );
      case 'estimated_completion_date':
        return client.estimated_completion_date ? (
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-1" />
            {new Date(client.estimated_completion_date).toLocaleDateString()}
          </div>
        ) : '-';
      case 'todos':
        return renderTodoItems(client.todos);
      case 'key_research':
        return (
          <div className="max-w-xs truncate" title={client.key_research || ''}>
            {isEditing ? (
              <Input
                ref={editInputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="h-8 min-w-[120px] border-border/50"
                autoFocus
              />
            ) : (
              <div onDoubleClick={handleDoubleClick}>
                {client.key_research || '-'}
              </div>
            )}
          </div>
        );
      default:
        const value = client[columnKey as keyof typeof client];
        if (isEditing) {
          return (
            <Input
              ref={editInputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="h-8 min-w-[120px] border-border/50"
              autoFocus
            />
          );
        } else if (Array.isArray(value)) {
          return <span>{value.length} items</span>;
        } else {
          return (
            <div onDoubleClick={handleDoubleClick}>
              {value !== undefined && value !== null ? String(value) : '-'}
            </div>
          );
        }
    }
  }

  function handleDeleteClient(clientId: string) {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        supabase
          .from('client_onboarding')
          .delete()
          .eq('id', clientId)
          .then(({ error }) => {
            if (error) throw error;
            
            toast({
              title: "Client deleted",
              description: "The client has been permanently removed."
            });
            
            refetch();
          });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error deleting client",
          description: error.message || "Failed to delete client."
        });
      }
    }
  }

  function renderTodoItems(todos?: TodoItem[]) {
    if (!todos || todos.length === 0) {
      return <span>-</span>;
    }
    
    const pendingTodos = todos.filter(t => !t.completed).length;
    return (
      <div className="flex items-center">
        <span className="bg-blue-500/10 text-blue-500 rounded-full px-2 py-0.5 text-xs">
          {pendingTodos} pending
        </span>
      </div>
    );
  }

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
      <ClientAnalyticsCards 
        activeClients={analyticsData.activeClients}
        pipelineClients={analyticsData.pipelineClients}
        pipelineValue={analyticsData.pipelineValue}
        conversionRate={analyticsData.conversionRate}
      />
      
      <ClientsHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        viewPreference={viewPreference}
        onViewPreferenceChange={onViewPreferenceChange}
        onAddClient={handleAddClient}
        totalClients={totalCount}
        clients={clients}
        onRefetch={refetch}
      />
      
      {selectedClients.length > 0 && (
        <div className="flex items-center gap-2 mb-4 py-2 px-4 rounded-lg bg-muted/30 border border-border/50 shadow-sm">
          <span className="text-sm font-medium">{selectedClients.length} clients selected</span>
          <Button variant="outline" size="sm" onClick={handleDeleteSelected} className="border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="outline" size="sm" className="border-border/50 hover:bg-muted/50">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      )}
      
      <div ref={tableContainerRef} className="relative overflow-hidden">
        <ScrollableTable pinnedColumns={pinnedColumns}>
          <Table ref={tableElementRef} className="w-full border-collapse">
            <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm z-20">
              <TableRow className="border-border/50">
                <TableHead className="w-12 bg-card/95 backdrop-blur-sm sticky left-0 z-30 table-header-cell">
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
                      className={`${isPinned ? 'sticky z-20 bg-card/95 backdrop-blur-sm' : ''} table-header-cell`}
                      style={{ 
                        minWidth: `${column.width || 150}px`,
                        width: `${column.width || 150}px`,
                        left: isPinned ? `${leftPosition}px` : undefined
                      }}
                    >
                      <DraggableColumnHeader
                        column={column}
                        index={index}
                        moveColumn={handleColumnReorder}
                        onSort={() => handleSort(column.key)}
                        onTogglePin={() => handleToggleColumnPin(index)}
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
                <TableRow className="border-border/50">
                  <TableCell colSpan={visibleColumns.length + 2} className="text-center h-32 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                      <p>No clients found matching your search criteria</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 border-border/50 hover:bg-muted/50"
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
                  <TableRow key={client.id} className="group border-border/50 table-row-hover">
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
                      
                      return (
                        <TableCell 
                          key={column.key}
                          className={`relative group ${isPinned ? 'sticky bg-background z-10' : ''}`}
                          style={{ 
                            left: isPinned ? `${leftPosition}px` : undefined,
                            maxWidth: `${column.width || 150}px`,
                          }}
                          onDoubleClick={() => handleStartEdit(client, column.key)}
                        >
                          {renderCellContent(client, column.key)}
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
          onClose={handleCloseDetails} 
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
