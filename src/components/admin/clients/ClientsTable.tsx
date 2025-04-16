
import { useState, useMemo } from 'react';
import { useClientsList } from '@/hooks/client';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatRelativeTime } from '@/lib/formatters';
import { 
  ArrowUpDown, 
  ChevronDown, 
  Download,
  Edit2, 
  ExternalLink, 
  Filter,
  MoreHorizontal, 
  Plus,
  RefreshCw,
  Trash2 
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
import * as React from 'react';

interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;
  type?: 'text' | 'number' | 'select' | 'date' | 'url' | 'status';
}

interface ClientsTableProps {
  searchQuery?: string;
  statusFilter?: string;
}

export function ClientsTable({ searchQuery = '', statusFilter = 'all' }: ClientsTableProps) {
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Selection state
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Active client state
  const [activeClient, setActiveClient] = useState<string | null>(null);
  
  // Column visibility state
  const [columns, setColumns] = useState<ColumnDef[]>([
    { key: 'full_name', label: 'Client', visible: true, required: true },
    { key: 'project_name', label: 'Project Name', visible: true },
    { key: 'company_niche', label: 'Company Niche', visible: true },
    { key: 'development_url', label: 'Development URL', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'updated_at', label: 'Last Updated', visible: true },
    { key: 'email', label: 'Email', visible: false },
    { key: 'phone', label: 'Phone', visible: false },
    { key: 'estimated_price', label: 'Project Value', visible: false },
    { key: 'start_date', label: 'Start Date', visible: false },
    { key: 'estimated_completion_date', label: 'Est. Completion', visible: false },
  ]);
  
  // Fetch client data
  const { clients, isLoading, totalCount, refetch } = useClientsList({
    page,
    pageSize,
    searchQuery,
    statusFilter, 
    sortColumn,
    sortDirection
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
  
  const totalPages = Math.ceil(totalCount / pageSize);

  // Table handlers
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
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

  const handleColumnsChange = (newColumns: ColumnDef[]) => {
    setColumns(newColumns);
    // Here we could save column preferences to user settings/local storage
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

  // Get visible columns
  const visibleColumns = columns.filter(col => col.visible);

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
            columns={columns} 
            onColumnsChange={handleColumnsChange}
          />
        </div>
      </div>
      
      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
                <TableHead key={column.key}>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort(column.key)} 
                    className="flex items-center font-semibold"
                  >
                    {column.label}
                    {sortColumn === column.key && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                </TableHead>
              ))}
              
              <TableHead className="w-12">Actions</TableHead>
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
                    switch (column.key) {
                      case 'full_name':
                        return (
                          <TableCell key={column.key}>
                            <div className="flex flex-col">
                              <span className="font-medium">{client.full_name || 'Unknown'}</span>
                              <span className="text-sm text-muted-foreground">{client.email || 'No email'}</span>
                            </div>
                          </TableCell>
                        );
                      case 'status':
                        return (
                          <TableCell key={column.key}>
                            <ClientStatusBadge status={client.status} />
                          </TableCell>
                        );
                      case 'updated_at':
                        return (
                          <TableCell key={column.key}>
                            {formatRelativeTime(client.updated_at)}
                          </TableCell>
                        );
                      case 'development_url':
                        return (
                          <TableCell key={column.key}>
                            {client.development_url ? (
                              <a 
                                href={client.development_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline flex items-center"
                              >
                                View <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            ) : '-'}
                          </TableCell>
                        );
                      default:
                        return (
                          <TableCell key={column.key}>
                            {client[column.key as keyof typeof client] || '-'}
                          </TableCell>
                        );
                    }
                  })}
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
