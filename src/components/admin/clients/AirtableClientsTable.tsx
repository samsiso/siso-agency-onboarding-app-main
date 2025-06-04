import * as React from "react";
import { useRef, useMemo, useState, useId } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleX,
  Columns3,
  Filter,
  ListFilter,
  Plus,
  Trash,
  Ellipsis,
  CircleAlert,
  Edit,
  Check,
  X
} from "lucide-react";
import { useClientsList } from "@/hooks/client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  Row
} from "@tanstack/react-table";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ClientData } from "@/types/client.types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ViewClientCard } from "./ViewClientCard";

// Inline editable cell component
interface EditableCellProps {
  value: string | number | undefined;
  onSave: (value: string) => void;
  type?: 'text' | 'select' | 'number';
  options?: { value: string; label: string }[];
  className?: string;
}

function EditableCell({ value, onSave, type = 'text', options, className }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(value || ''));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        {type === 'select' && options ? (
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            type={type === 'number' ? 'number' : 'text'}
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        )}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-6 w-6 p-0 text-green-400 hover:bg-green-400/20"
          >
            <Check size={12} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/20"
          >
            <X size={12} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer px-2 py-1 rounded hover:bg-gray-800/50 min-h-[32px] flex items-center group",
        className
      )}
    >
      <span className="flex-1">{value || '-'}</span>
      <Edit size={12} className="opacity-0 group-hover:opacity-50 text-gray-400 ml-2" />
    </div>
  );
}

// Map status to badge color
function statusToBadge(status: string) {
  switch (status) {
    case 'completed':
    case 'converted':
      return <Badge className="bg-green-500/20 text-green-400">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    case 'contacted':
    case 'in_progress':
      return <Badge className="bg-blue-500/20 text-blue-400">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    case 'pending':
    case 'new':
    default:
      return <Badge className="bg-amber-500/20 text-amber-400">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }
}

type TableClient = ClientData & { id: string; };

// Status options for dropdown
const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'converted', label: 'Converted' }
];

// Enhanced columns with inline editing
const createColumns = (
  onUpdateField: (id: string, field: string, value: string) => void
): ColumnDef<TableClient>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="border-gray-600 data-[state=checked]:bg-orange-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-gray-600 data-[state=checked]:bg-orange-600"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "full_name",
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("full_name")}
        onSave={(value) => onUpdateField(row.original.id, 'full_name', value)}
        className="font-medium"
      />
    ),
    size: 180,
    enableHiding: false,
    filterFn: (row, columnId, filterValue) => {
      const rowValue = [row.original.full_name, row.original.email || ""].join(" ").toLowerCase();
      return rowValue.includes((filterValue ?? "").toLowerCase());
    },
  },
  {
    header: "Email",
    accessorKey: "email",
    size: 210,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("email")}
        onSave={(value) => onUpdateField(row.original.id, 'email', value)}
      />
    )
  },
  {
    header: "Business Name",
    accessorKey: "business_name",
    size: 170,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("business_name")}
        onSave={(value) => onUpdateField(row.original.id, 'business_name', value)}
      />
    )
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("status")}
        onSave={(value) => onUpdateField(row.original.id, 'status', value)}
        type="select"
        options={statusOptions}
      />
    ),
    size: 120,
    filterFn: (row, columnId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      const status = row.getValue(columnId) as string;
      return filterValue.includes(status);
    },
  },
  {
    header: "Project",
    accessorKey: "project_name",
    size: 190,
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("project_name")}
        onSave={(value) => onUpdateField(row.original.id, 'project_name', value)}
      />
    )
  },
  {
    header: "Balance",
    accessorKey: "estimated_price",
    cell: ({ row }) => (
      <EditableCell
        value={row.getValue("estimated_price")}
        onSave={(value) => onUpdateField(row.original.id, 'estimated_price', value)}
        type="number"
      />
    ),
    size: 120,
  },
  {
    id: "viewClient",
    header: "Client Page",
    cell: ({ row }) => {
      return <ViewClientCard clientId={row.original.id} />;
    },
    size: 130,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} onUpdateField={onUpdateField} />,
    size: 60,
    enableHiding: false,
  }
];

import { AirtableTable } from "@/components/common/AirtableTable";

function RowActions({ 
  row, 
  onUpdateField 
}: { 
  row: Row<TableClient>;
  onUpdateField: (id: string, field: string, value: string) => void;
}) {
  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete client:', row.original.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button 
            size="icon" 
            variant="ghost" 
            className="shadow-none text-gray-400 hover:text-white hover:bg-gray-800" 
            aria-label="Edit client"
          >
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
        <DropdownMenuLabel className="text-gray-200">Client Actions</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
        >
          <Trash size={14} className="mr-2" />
          Delete Client
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Add new row component
interface AddNewRowProps {
  onAddClient: (clientData: Partial<ClientData>) => void;
  columnsCount: number;
}

function AddNewRow({ onAddClient, columnsCount }: AddNewRowProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newClient, setNewClient] = useState<Partial<ClientData>>({
    full_name: '',
    email: '',
    business_name: '',
    status: 'new',
    project_name: '',
    estimated_price: 0
  });

  const handleSave = () => {
    if (newClient.full_name || newClient.business_name) {
      onAddClient(newClient);
      setNewClient({
        full_name: '',
        email: '',
        business_name: '',
        status: 'new',
        project_name: '',
        estimated_price: 0
      });
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewClient({
      full_name: '',
      email: '',
      business_name: '',
      status: 'new',
      project_name: '',
      estimated_price: 0
    });
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <TableRow className="border-orange-500/30 bg-gray-800/30">
        <TableCell>
          <Checkbox disabled className="border-gray-600" />
        </TableCell>
        <TableCell>
          <Input
            value={newClient.full_name || ''}
            onChange={(e) => setNewClient(prev => ({ ...prev, full_name: e.target.value }))}
            placeholder="Full Name"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={newClient.email || ''}
            onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email"
            type="email"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={newClient.business_name || ''}
            onChange={(e) => setNewClient(prev => ({ ...prev, business_name: e.target.value }))}
            placeholder="Business Name"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Select 
            value={newClient.status || 'new'} 
            onValueChange={(value) => setNewClient(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger className="h-8 bg-gray-800 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {statusOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Input
            value={newClient.project_name || ''}
            onChange={(e) => setNewClient(prev => ({ ...prev, project_name: e.target.value }))}
            placeholder="Project Name"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>
          <Input
            value={newClient.estimated_price || ''}
            onChange={(e) => setNewClient(prev => ({ ...prev, estimated_price: parseFloat(e.target.value) || 0 }))}
            placeholder="0.00"
            type="number"
            className="h-8 bg-gray-800 border-gray-600 text-white"
          />
        </TableCell>
        <TableCell>-</TableCell>
        <TableCell>
          <div className="flex gap-1">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
            >
              <Check size={12} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              className="h-6 w-6 p-0 text-red-400 hover:bg-red-400/20"
            >
              <X size={12} />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow 
      className="border-dashed border-gray-600 hover:bg-gray-800/50 cursor-pointer"
      onClick={() => setIsAdding(true)}
    >
      <TableCell colSpan={columnsCount} className="text-center py-4">
        <div className="flex items-center justify-center gap-2 text-gray-400 hover:text-orange-400">
          <Plus size={16} />
          <span>Add new client</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AirtableClientsTable({
  searchQuery = "",
  statusFilter = "all",
  onSearchChange,
  onStatusFilterChange,
}: {
  searchQuery?: string;
  statusFilter?: string;
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
}) {
  const id = useId();
  const { toast } = useToast();

  // Use our clients list hook
  const { clients, totalCount, isLoading, refetch } = useClientsList({
    searchQuery,
    statusFilter,
    sortColumn: "updated_at",
    sortDirection: "desc"
  });

  // Table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "full_name", desc: false }]);

  // Handle field updates
  const handleUpdateField = async (id: string, field: string, value: string) => {
    try {
      // TODO: Implement actual API call to update client
      console.log('Updating client:', { id, field, value });
      
      toast({
        title: "Client Updated",
        description: `${field} has been updated successfully.`,
      });
      
      // Refetch data to get latest changes
      await refetch();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle adding new client
  const handleAddClient = async (clientData: Partial<ClientData>) => {
    try {
      // TODO: Implement actual API call to create client
      console.log('Adding new client:', clientData);
      
      toast({
        title: "Client Added",
        description: "New client has been added successfully.",
      });
      
      // Refetch data to include new client
      await refetch();
    } catch (error) {
      toast({
        title: "Add Failed",
        description: "Failed to add new client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns = useMemo(() => createColumns(handleUpdateField), []);

  const data: TableClient[] = React.useMemo(
    () => clients.map(c => ({ ...c, id: c.id })),
    [clients]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    enableSortingRemoval: false,
    manualPagination: false,
  });

  // Enhanced AirtableTable with add row functionality
  return (
    <div className="w-full px-0 sm:px-2 lg:px-4 xl:px-0">
      <AirtableTable
        table={table}
        columns={columns}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={onSearchChange}
        onStatusFilterChange={onStatusFilterChange}
        renderRowActions={(row) => <RowActions row={row} onUpdateField={handleUpdateField} />}
        statusBadge={statusToBadge}
        addButton={
          <Button className="ml-auto bg-orange-600 hover:bg-orange-700 text-white" variant="default">
            <Plus className="-ms-1 me-2 opacity-90" size={16} strokeWidth={2} aria-hidden="true" />
            Add client
          </Button>
        }
        deleteSelectedTitle="Delete client(s)"
        addNewRow={<AddNewRow onAddClient={handleAddClient} columnsCount={columns.length} />}
      />
    </div>
  );
}
