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
  DropdownMenuLabel
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
  CircleAlert
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

import { ViewClientCard } from "./ViewClientCard";

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

// Add a new column for "Go to Client Page"
const columns: ColumnDef<TableClient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "full_name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("full_name")}</div>,
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
    cell: ({ row }) => <span>{row.getValue("email") ?? "-"}</span>
  },
  {
    header: "Business Name",
    accessorKey: "business_name",
    size: 170,
    cell: ({ row }) => <span>{row.getValue("business_name") ?? "-"}</span>
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => statusToBadge(String(row.getValue("status") || "")),
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
    cell: ({ row }) => <span>{row.getValue("project_name") ?? "-"}</span>
  },
  {
    header: "Balance",
    accessorKey: "estimated_price",
    cell: ({ row }) => {
      const price = row.getValue("estimated_price");
      if (!price) return "-";
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(price));
    },
    size: 120,
  },
  {
    id: "viewClient",
    header: "Client Page",
    cell: ({ row }) => {
      // Use new card component that matches "active" badge styling and in-app navigation
      return <ViewClientCard clientId={row.original.id} />;
    },
    size: 130,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  }
];

import { AirtableTable } from "@/components/common/AirtableTable";

function RowActions({ row }: { row: Row<TableClient> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit client">
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Client Actions</DropdownMenuLabel>
        <DropdownMenuCheckboxItem>Add/Edit/Details (Not Implemented)</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Archive Client</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Delete</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Use our clients list hook
  const { clients, totalCount, isLoading } = useClientsList({
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

  // Provide add client button, etc. through props to AirtableTable
  return (
    <AirtableTable
      table={table}
      columns={columns}
      searchQuery={searchQuery}
      statusFilter={statusFilter}
      onSearchChange={onSearchChange}
      onStatusFilterChange={onStatusFilterChange}
      renderRowActions={(row) => <RowActions row={row} />}
      statusBadge={statusToBadge}
      addButton={
        <Button className="ml-auto" variant="outline">
          <Plus className="-ms-1 me-2 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
          Add client
        </Button>
      }
      deleteSelectedTitle="Delete client(s)"
    />
  );
}
