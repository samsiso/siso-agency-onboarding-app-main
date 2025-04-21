
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EnhancedTable, 
  EnhancedTableHeader, 
  EnhancedTableBody, 
  EnhancedTableRow, 
  EnhancedTableHead, 
  EnhancedTableCell,
  EditableCell
} from '@/components/ui/enhanced-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Columns, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckIcon, 
  X,
  CalendarIcon,
  Link,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClientData } from '@/types/client.types';
import { useClientsList } from '@/hooks/client';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ClientsEnhancedTableProps {
  searchQuery?: string;
  statusFilter?: string;
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

export function ClientsEnhancedTable({
  searchQuery = '',
  statusFilter = 'all',
  onSearchChange,
  onStatusFilterChange
}: ClientsEnhancedTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clients, totalCount, isLoading, refetch } = useClientsList({
    searchQuery,
    statusFilter,
    sortColumn: "updated_at",
    sortDirection: "desc"
  });

  // State
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle select all clients
  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((client) => client.id));
    }
  };

  // Handle select single client
  const handleSelectClient = (id: string) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter((clientId) => clientId !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  // Handle cell click for editing
  const handleCellClick = (client: ClientData, field: string) => {
    if (editingCell) return;
    
    setEditingCell({ id: client.id, field });
    setEditValue(String(client[field as keyof ClientData] || ''));
  };

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle save cell edit
  const handleSaveEdit = async () => {
    if (!editingCell) return;

    try {
      setIsSaving(true);
      
      const { id, field } = editingCell;
      
      const { error } = await supabase
        .from('client_onboarding')
        .update({ 
          [field]: editValue,
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
      setIsSaving(false);
      setEditingCell(null);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleSaveEdit();
      
      // Navigate to next cell (if we decide to implement this later)
      // We would need to determine which cell is next based on the current field
      // and row, and then call handleCellClick with the next cell's info
    }
  };

  // Handle row click to view client details
  const handleRowClick = (client: ClientData, e: React.MouseEvent) => {
    // Check if clicking on a checkbox or editable cell
    if (e.target instanceof HTMLElement) {
      const isCheckbox = e.target.closest('[role="checkbox"]');
      const isEditingArea = e.target.closest('[data-editing="true"]');
      
      if (isCheckbox || isEditingArea || editingCell) return;
      
      navigate(`/admin/clients/${client.id}`);
    }
  };

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'converted':
        return <Badge variant="success">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
      case 'contacted':
      case 'in_progress':
        return <Badge variant="info">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
      case 'pending':
      case 'new':
      default:
        return <Badge variant="warning">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-6">Loading clients...</div>;
  }

  return (
    <div className="border rounded-md shadow-sm overflow-hidden bg-background/50 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <EnhancedTable>
          <EnhancedTableHeader>
            <EnhancedTableRow>
              <EnhancedTableHead className="w-10">
                <Checkbox 
                  checked={selectedClients.length === clients.length && clients.length > 0} 
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all clients"
                />
              </EnhancedTableHead>
              
              <EnhancedTableHead 
                canSort 
                isSorted={sortColumn === 'full_name' ? sortDirection : false}
                onClick={() => handleSort('full_name')}
              >
                Name
              </EnhancedTableHead>
              
              <EnhancedTableHead>Email</EnhancedTableHead>
              
              <EnhancedTableHead>Business</EnhancedTableHead>
              
              <EnhancedTableHead 
                canSort 
                isSorted={sortColumn === 'status' ? sortDirection : false}
                onClick={() => handleSort('status')}
              >
                Status
              </EnhancedTableHead>
              
              <EnhancedTableHead>Project</EnhancedTableHead>
              
              <EnhancedTableHead 
                canSort 
                isSorted={sortColumn === 'estimated_price' ? sortDirection : false}
                onClick={() => handleSort('estimated_price')}
              >
                Balance
              </EnhancedTableHead>
              
              <EnhancedTableHead 
                canSort 
                isSorted={sortColumn === 'updated_at' ? sortDirection : false}
                onClick={() => handleSort('updated_at')}
              >
                Last Update
              </EnhancedTableHead>
              
              <EnhancedTableHead>Actions</EnhancedTableHead>
            </EnhancedTableRow>
          </EnhancedTableHeader>
          
          <EnhancedTableBody>
            {clients.length === 0 ? (
              <EnhancedTableRow>
                <EnhancedTableCell colSpan={9} className="h-24 text-center">
                  No clients found
                </EnhancedTableCell>
              </EnhancedTableRow>
            ) : (
              clients.map((client) => {
                const isSelected = selectedClients.includes(client.id);
                
                return (
                  <EnhancedTableRow 
                    key={client.id}
                    isSelected={isSelected}
                    isEditing={editingCell?.id === client.id}
                    onClick={(e) => handleRowClick(client, e)}
                  >
                    <EnhancedTableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleSelectClient(client.id)}
                        aria-label={`Select ${client.full_name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell
                      isEditable
                      isEditing={editingCell?.id === client.id && editingCell?.field === 'full_name'}
                      onEdit={() => handleCellClick(client, 'full_name')}
                      isSaving={isSaving && editingCell?.id === client.id && editingCell?.field === 'full_name'}
                      data-editing={editingCell?.id === client.id && editingCell?.field === 'full_name'}
                    >
                      {editingCell?.id === client.id && editingCell?.field === 'full_name' ? (
                        <EditableCell
                          value={editValue}
                          onValueChange={setEditValue}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSaveEdit}
                        />
                      ) : (
                        <div className="font-medium">{client.full_name || '-'}</div>
                      )}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell
                      isEditable
                      isEditing={editingCell?.id === client.id && editingCell?.field === 'email'}
                      onEdit={() => handleCellClick(client, 'email')}
                      isSaving={isSaving && editingCell?.id === client.id && editingCell?.field === 'email'}
                      data-editing={editingCell?.id === client.id && editingCell?.field === 'email'}
                    >
                      {editingCell?.id === client.id && editingCell?.field === 'email' ? (
                        <EditableCell
                          value={editValue}
                          onValueChange={setEditValue}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSaveEdit}
                        />
                      ) : (
                        <span className="text-muted-foreground">{client.email || '-'}</span>
                      )}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell
                      isEditable
                      isEditing={editingCell?.id === client.id && editingCell?.field === 'business_name'}
                      onEdit={() => handleCellClick(client, 'business_name')}
                      isSaving={isSaving && editingCell?.id === client.id && editingCell?.field === 'business_name'}
                      data-editing={editingCell?.id === client.id && editingCell?.field === 'business_name'}
                    >
                      {editingCell?.id === client.id && editingCell?.field === 'business_name' ? (
                        <EditableCell
                          value={editValue}
                          onValueChange={setEditValue}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSaveEdit}
                        />
                      ) : (
                        <span>{client.business_name || '-'}</span>
                      )}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell
                      isEditable
                      isEditing={editingCell?.id === client.id && editingCell?.field === 'status'}
                      onEdit={() => handleCellClick(client, 'status')}
                      isSaving={isSaving && editingCell?.id === client.id && editingCell?.field === 'status'}
                      data-editing={editingCell?.id === client.id && editingCell?.field === 'status'}
                    >
                      {editingCell?.id === client.id && editingCell?.field === 'status' ? (
                        <EditableCell
                          value={editValue}
                          onValueChange={setEditValue}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSaveEdit}
                        />
                      ) : (
                        getStatusBadge(client.status)
                      )}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell
                      isEditable
                      isEditing={editingCell?.id === client.id && editingCell?.field === 'project_name'}
                      onEdit={() => handleCellClick(client, 'project_name')}
                      isSaving={isSaving && editingCell?.id === client.id && editingCell?.field === 'project_name'}
                      data-editing={editingCell?.id === client.id && editingCell?.field === 'project_name'}
                    >
                      {editingCell?.id === client.id && editingCell?.field === 'project_name' ? (
                        <EditableCell
                          value={editValue}
                          onValueChange={setEditValue}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSaveEdit}
                        />
                      ) : (
                        <span>{client.project_name || '-'}</span>
                      )}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell
                      isEditable
                      isEditing={editingCell?.id === client.id && editingCell?.field === 'estimated_price'}
                      onEdit={() => handleCellClick(client, 'estimated_price')}
                      isSaving={isSaving && editingCell?.id === client.id && editingCell?.field === 'estimated_price'}
                      data-editing={editingCell?.id === client.id && editingCell?.field === 'estimated_price'}
                    >
                      {editingCell?.id === client.id && editingCell?.field === 'estimated_price' ? (
                        <EditableCell
                          value={editValue}
                          onValueChange={setEditValue}
                          onKeyDown={handleKeyDown}
                          onBlur={handleSaveEdit}
                        />
                      ) : (
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{client.estimated_price ? client.estimated_price.toLocaleString() : '-'}</span>
                        </div>
                      )}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell>
                      {formatDate(client.updated_at)}
                    </EnhancedTableCell>
                    
                    <EnhancedTableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/clients/${client.id}`);
                          }}
                        >
                          <Link className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </div>
                    </EnhancedTableCell>
                  </EnhancedTableRow>
                );
              })
            )}
          </EnhancedTableBody>
        </EnhancedTable>
      </div>
    </div>
  );
}
