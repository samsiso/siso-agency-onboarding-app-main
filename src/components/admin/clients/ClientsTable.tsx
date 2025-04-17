import { useState, useMemo, useRef, useEffect } from 'react';
import { useClientsList } from '@/hooks/client';
import { ClientData, ClientViewPreference, TodoItem } from '@/types/client.types';
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
  DollarSign
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

interface ClientsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
}

export function ClientsTable({ 
  searchQuery = '', 
  statusFilter = 'all',
  viewPreference,
  onViewPreferenceChange
}: ClientsTableProps) {
  // Pagination state
  const [page, setPage] = useState(1);
  
  // Selection state
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  // Active client state
  const [activeClient, setActiveClient] = useState<string | null>(null);
  
  // Client add form state
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  // Get column definitions from view preferences
  const visibleColumns = useMemo(() => 
    viewPreference.columns.filter(col => col.visible),
    [viewPreference.columns]
  );
  
  // Fetch client data
  const { clients, isLoading, totalCount, refetch } = useClientsList({
    page,
    pageSize: viewPreference.pageSize,
    searchQuery,
    statusFilter, 
    sortColumn: viewPreference.sortColumn,
    sortDirection: viewPreference.sortDirection
  });
  
  // Calculate analytics data
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

  // Handle adding a new client
  const handleAddClient = () => {
    setIsAddClientOpen(true);
  };
  
  // Handle client add success
  const handleClientAddSuccess = () => {
    refetch();
    toast({
      title: "Client added successfully",
      description: "The new client has been added to your list."
    });
  };

  // Start editing a cell
  const handleStartEdit = (client: ClientData, field: string) => {
    setEditingCell({ id: client.id, field });
    setEditValue(String(client[field as keyof ClientData] || ''));
    
    // Focus the input after it renders
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  // Save edited cell value
  const handleSaveEdit = async () => {
    if (!editingCell) return;
    
    try {
      // Update the value in the database
      const { error } = await supabase
        .from('client_onboarding')
        .update({ 
          [editingCell.field]: editValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCell.id);
        
      if (error) throw error;
      
      toast({
        title: "Update successful",
        description: `Updated ${editingCell.field} for this client.`
      });
      
      // Refresh the data
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

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Handle keydown events in edit mode
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Table handlers
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

  const handleColumnReorder = (dragIndex: number, hoverIndex: number) => {
    const newColumns = [...viewPreference.columns];
    const dragItem = newColumns[dragIndex];
    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, dragItem);
    
    onViewPreferenceChange({ columns: newColumns });
  };

  // Scroll table to horizontally when editing cells
  useEffect(() => {
    if (editingCell && editInputRef.current) {
      const cell = editInputRef.current.parentElement;
      if (cell) {
        cell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [editingCell]);

  // Handle deletion of selected clients
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Analytics Cards Loading State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        
        {/* Table Loading State */}
        <div className="rounded-md border bg-card">
          <div className="h-12 border-b flex items-center px-4 py-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32 ml-4" />
          </div>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="border-b px-4 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <ClientAnalyticsCards 
        activeClients={analyticsData.activeClients}
        pipelineClients={analyticsData.pipelineClients}
        pipelineValue={analyticsData.pipelineValue}
        conversionRate={analyticsData.conversionRate}
      />
      
      {/* Table Header with Actions */}
      <ClientsHeader
        searchQuery={searchQuery}
        onSearchChange={(value) => {/* handle search change */}}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {/* handle status filter change */}}
        viewPreference={viewPreference}
        onViewPreferenceChange={onViewPreferenceChange}
        onAddClient={handleAddClient}
        totalClients={totalCount}
      />
      
      {/* Table Actions for Selected Items */}
      {selectedClients.length > 0 && (
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted rounded-md">
          <span className="text-sm font-medium">{selectedClients.length} selected</span>
          <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      )}
      
      {/* Clients Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedClients.length === clients.length && clients.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all clients"
                    className={selectedClients.length > 0 && selectedClients.length < clients.length ? "opacity-80" : ""}
                  />
                </TableHead>
                
                {visibleColumns.map(column => (
                  <TableHead 
                    key={column.key} 
                    className="min-w-[120px]"
                    style={{ width: column.width ? `${column.width}px` : 'auto' }}
                  >
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort(column.key)} 
                      className="flex items-center font-semibold hover:bg-transparent"
                    >
                      <span className="capitalize">{column.label || column.key.replace(/_/g, ' ')}</span>
                      {viewPreference.sortColumn === column.key && (
                        <ArrowUpDown className={`ml-1 h-4 w-4 ${viewPreference.sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                      )}
                    </Button>
                  </TableHead>
                ))}
                
                <TableHead className="w-12 sticky right-0 bg-background">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 2} className="text-center h-32 text-muted-foreground">
                    No clients found matching your search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="group">
                    <TableCell>
                      <Checkbox 
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleSelectClient(client.id)}
                        aria-label={`Select ${client.full_name}`}
                      />
                    </TableCell>
                    
                    {visibleColumns.map(column => {
                      // Check if this cell is being edited
                      const isEditing = editingCell?.id === client.id && editingCell?.field === column.key;
                      
                      // Format cell based on column type
                      const renderCell = () => {
                        // If in edit mode, show input field
                        if (isEditing) {
                          return (
                            <div className="flex items-center">
                              <Input
                                ref={editInputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                className="h-8 min-w-[120px]"
                                autoFocus
                              />
                              <div className="flex items-center ml-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6" 
                                  onClick={handleSaveEdit}
                                >
                                  <Check className="h-3 w-3 text-green-500" />
                                </Button>
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="h-6 w-6" 
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          );
                        }

                        // Custom rendering for specific column types
                        switch (column.key) {
                          case 'full_name':
                            return (
                              <div className="flex flex-col">
                                <span 
                                  className="font-medium cursor-pointer hover:underline" 
                                  onClick={() => handleOpenDetails(client.id)}
                                >
                                  {client.full_name || 'Unknown'}
                                </span>
                                <span className="text-sm text-muted-foreground">{client.email || 'No email'}</span>
                              </div>
                            );
                          case 'status':
                            return <ClientStatusBadge status={client.status} />;
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
                                {client.next_steps || '-'}
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
                            // Fix: Don't return the array directly, render it properly
                            return client.todos && client.todos.length > 0 ? (
                              <div className="flex items-center">
                                <span className="bg-blue-500/10 text-blue-500 rounded-full px-2 py-0.5 text-xs">
                                  {client.todos.filter(t => !t.completed).length} pending
                                </span>
                              </div>
                            ) : '-';
                          case 'key_research':
                            return (
                              <div className="max-w-xs truncate" title={client.key_research || ''}>
                                {client.key_research || '-'}
                              </div>
                            );
                          default:
                            return client[column.key as keyof typeof client] || '-';
                        }
                      };

                      return (
                        <TableCell 
                          key={column.key}
                          className="relative group"
                          onDoubleClick={() => handleStartEdit(client, column.key)}
                        >
                          {renderCell()}
                          {!isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleStartEdit(client, column.key)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      );
                    })}
                    
                    <TableCell className="sticky right-0 bg-background">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenDetails(client.id)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStartEdit(client, 'full_name')}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Client
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this client?')) {
                                try {
                                  const { error } = await supabase
                                    .from('client_onboarding')
                                    .delete()
                                    .eq('id', client.id);
                                  
                                  if (error) throw error;
                                  
                                  toast({
                                    title: "Client deleted",
                                    description: "The client has been permanently removed."
                                  });
                                  
                                  refetch();
                                } catch (error: any) {
                                  toast({
                                    variant: "destructive",
                                    title: "Error deleting client",
                                    description: error.message || "Failed to delete client."
                                  });
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
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
                  // Add ellipsis
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

      {/* Client Details Drawer */}
      {activeClient && (
        <ClientDetailSheet 
          clientId={activeClient} 
          isOpen={!!activeClient} 
          onClose={handleCloseDetails} 
        />
      )}
      
      {/* Client Add Form */}
      <ClientAddForm 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen} 
        onSuccess={handleClientAddSuccess}
      />
    </div>
  );
}
