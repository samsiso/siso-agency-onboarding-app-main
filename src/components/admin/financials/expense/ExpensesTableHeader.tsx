
import { TableHead, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { TableColumn } from "@/hooks/useTableColumns";

interface ExpensesTableHeaderProps {
  visibleColumns: TableColumn[];
  onSort: (field: string) => void;
}

export function ExpensesTableHeader({ visibleColumns, onSort }: ExpensesTableHeaderProps) {
  return (
    <TableRow>
      {visibleColumns.map(col => (
        col.key === "description" ? (
          <TableHead key={col.key} className="w-[250px]">
            <div className="flex items-center cursor-pointer" onClick={() => onSort("name")}>
              {col.label}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
        ) : col.key === "category" ? (
          <TableHead key={col.key}>
            <div className="flex items-center cursor-pointer" onClick={() => onSort("category")}>
              {col.label}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
        ) : col.key === "amount" ? (
          <TableHead key={col.key}>
            <div className="flex items-center cursor-pointer" onClick={() => onSort("amount")}>
              {col.label}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
        ) : col.key === "date" ? (
          <TableHead key={col.key}>
            <div className="flex items-center cursor-pointer" onClick={() => onSort("date")}>
              {col.label}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </TableHead>
        ) : (
          <TableHead key={col.key}>{col.label}</TableHead>
        )
      ))}
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  );
}
