
"use client";

import React, { useState } from "react";
import { useClientsList } from "@/hooks/client";
import { ClientData } from "@/types/client.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/enhanced-table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AirtableClientsTableProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange?: (query: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

export function AirtableClientsTable({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
}: AirtableClientsTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "updated_at",
      desc: true,
    },
  ]);

  const columns: ColumnDef<ClientData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      enableSorting: false,
      size: 40,
    },
    {
      header: "Name",
      accessorKey: "full_name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.avatar_url && (
            <img
              src={row.original.avatar_url}
              alt={row.original.full_name || "Avatar"}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <div className="font-medium">{row.getValue("full_name")}</div>
        </div>
      ),
      size: 200,
    },
    {
      header: "Business",
      accessorKey: "business_name",
      cell: ({ row }) => row.original.business_name || "-",
      size: 180,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("status")}
        </Badge>
      ),
      size: 120,
    },
    {
      header: "Project",
      accessorKey: "project_name",
      cell: ({ row }) => row.original.project_name || "-",
      size: 180,
    },
    {
      header: "Industry",
      accessorKey: "company_niche",
      cell: ({ row }) => row.original.company_niche || "-",
      size: 160,
    },
    {
      header: "Budget",
      accessorKey: "estimated_price",
      cell: ({ row }) => {
        const amount = row.original.estimated_price;
        return amount ? formatCurrency(amount) : "-";
      },
      size: 120,
    },
    {
      header: "Payment Status",
      accessorKey: "payment_status",
      cell: ({ row }) => (
        row.original.payment_status ? (
          <Badge variant="outline" className="capitalize">
            {row.original.payment_status}
          </Badge>
        ) : "-"
      ),
      size: 140,
    },
    {
      header: "Priority",
      accessorKey: "priority",
      cell: ({ row }) => (
        <Badge variant={row.original.priority?.toLowerCase() === "high" ? "destructive" : "outline"} className="capitalize">
          {row.original.priority || "None"}
        </Badge>
      ),
      size: 100,
    },
    {
      header: "Start Date",
      accessorKey: "start_date",
      cell: ({ row }) => row.original.start_date ? formatDate(row.original.start_date) : "-",
      size: 120,
    },
    {
      header: "Due Date",
      accessorKey: "estimated_completion_date",
      cell: ({ row }) => row.original.estimated_completion_date ? formatDate(row.original.estimated_completion_date) : "-",
      size: 120,
    },
    {
      header: "Last Updated",
      accessorKey: "updated_at",
      cell: ({ row }) => formatDate(row.getValue("updated_at")),
      size: 120,
    },
  ];

  const { clients, isLoading } = useClientsList({
    searchQuery,
    statusFilter,
    sortColumn: sorting[0]?.id,
    sortDirection: sorting[0]?.desc ? "desc" : "asc",
  });

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    enableSortingRemoval: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="relative h-11 select-none [&>.cursor-col-resize]:last:opacity-0"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(
                        header.column.getCanSort() &&
                          "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                      onKeyDown={(e) => {
                        if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          header.column.getToggleSortingHandler()?.(e);
                        }
                      }}
                      tabIndex={header.column.getCanSort() ? 0 : undefined}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUp className="h-4 w-4" />,
                        desc: <ChevronDown className="h-4 w-4" />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer"
                data-state={row.getIsSelected() && "selected"}
                onClick={(e) => {
                  // Prevent navigation if clicking checkbox
                  if (!(e.target as HTMLElement).closest('[role="checkbox"]')) {
                    navigate(`/admin/clients/${row.original.id}`);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No clients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
