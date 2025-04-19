
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  visible: boolean;
}

interface ColumnCustomizationProps {
  columns: Column[];
  onColumnVisibilityChange: (columns: Column[]) => void;
}

export function ColumnCustomization({ columns, onColumnVisibilityChange }: ColumnCustomizationProps) {
  const [localColumns, setLocalColumns] = useState(columns);

  const toggleColumn = (columnKey: string) => {
    const updatedColumns = localColumns.map(col => {
      if (col.key === columnKey) {
        return { ...col, visible: !col.visible };
      }
      return col;
    });
    setLocalColumns(updatedColumns);
    onColumnVisibilityChange(updatedColumns);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {localColumns.map((column) => (
          <DropdownMenuItem
            key={column.key}
            className="flex items-center space-x-2"
            onClick={() => toggleColumn(column.key)}
          >
            <input
              type="checkbox"
              checked={column.visible}
              onChange={() => {}}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>{column.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
