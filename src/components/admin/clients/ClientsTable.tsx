
import { useState, useMemo, useRef, useEffect } from 'react';
import { useClientsList } from '@/hooks/client';
import { ClientData, ClientViewPreference } from '@/types/client.types';
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
import { ColumnManager } from './ColumnManager';
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
  Filter,
  MoreHorizontal, 
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientDetailSheet } from './ClientDetailSheet';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import * as React from 'react';

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
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);

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
  const handleSaveEdit = () => {
    if (!editingCell) return;
    
    // In a real implementation, this would make an API call to update the data
    toast.success(`Updated ${editingCell.field} for client ${editingCell.id}`);
    console.log('Saving edit:', editingCell, editValue);
    
    setEditingCell(null);
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

  const handleColumnsChange = (newColumns: typeof viewPreference.columns) => {
    // Ensure the columns have label property
    const columnsWithLabels = newColumns.map(col => {
      if (!col.label) {
        return {
          ...col,
          label: col.key.replace(/_/g, ' ').split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        };
      }
      return col;
    });
    
    onViewPreferenceChange({ columns: columnsWithLabels });
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
      
      {/* Table Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {selectedClients.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedClients.length} selected</span>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Client
            </Button>
          )}
          
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <ColumnManager 
            columns={viewPreference.columns} 
            onColumnsChange={handleColumnsChange}
          />
        </div>
      </div>
      
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
                  >
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort(column.key)} 
                      className="flex items-center font-semibold hover:bg-transparent"
                    >
                      <span className="capitalize">{column.key.replace(/_/g, ' ')}</span>
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
                                <span className="font-medium">{client.full_name || 'Unknown'}</span>
                                <span className="text-sm text-muted-foreground">{client.email || 'No email'}</span>
                              </div>
                            );
                          case 'status':
                            return <ClientStatusBadge status={client.status} />;
                          case 'updated_at':
                            return formatRelativeTime(client.updated_at);
                          case 'development_url':
                            return client.development_url ? (
                              <a 
                                href={client.development_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline flex items-center"
                              >
                                View <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            ) : '-';
                          case 'estimated_price':
                            return client.estimated_price 
                              ? `$${client.estimated_price.toLocaleString()}` 
                              : '-';
                          case 'start_date':
                          case 'estimated_completion_date':
                            return client[column.key as keyof typeof client] 
                              ? new Date(client[column.key as keyof typeof client] as string).toLocaleDateString() 
                              : '-';
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
                      <TooltipProvider>
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
                            <DropdownMenuItem>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit Client
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TooltipProvider>
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
    </div>
  );
}
