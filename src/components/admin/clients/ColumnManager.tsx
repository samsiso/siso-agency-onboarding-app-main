
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings2 } from 'lucide-react';

interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;
  type?: 'text' | 'number' | 'select' | 'date' | 'url' | 'status';
}

interface ColumnManagerProps {
  columns: ColumnDef[];
  onColumnsChange: (columns: ColumnDef[]) => void;
}

export function ColumnManager({ columns, onColumnsChange }: ColumnManagerProps) {
  const [localColumns, setLocalColumns] = useState<ColumnDef[]>(columns);

  const handleColumnToggle = (columnKey: string) => {
    const newColumns = localColumns.map(col => {
      if (col.key === columnKey && !col.required) {
        return { ...col, visible: !col.visible };
      }
      return col;
    });
    
    setLocalColumns(newColumns);
    onColumnsChange(newColumns);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex items-center">
          <Settings2 className="h-4 w-4 mr-2" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {localColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={column.visible}
            disabled={column.required}
            onCheckedChange={() => handleColumnToggle(column.key)}
          >
            {column.label}
            {column.required && <span className="ml-1 text-xs text-muted-foreground">(required)</span>}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
