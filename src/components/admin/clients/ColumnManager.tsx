
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
import { ClientColumnPreference } from '@/types/client.types';

interface ColumnManagerProps {
  columns: ClientColumnPreference[];
  onColumnsChange: (columns: ClientColumnPreference[]) => void;
}

export function ColumnManager({ columns, onColumnsChange }: ColumnManagerProps) {
  const [localColumns, setLocalColumns] = useState<ClientColumnPreference[]>(columns);

  const handleColumnToggle = (columnKey: string) => {
    const newColumns = localColumns.map(col => {
      if (col.key === columnKey) {
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
            onCheckedChange={() => handleColumnToggle(column.key)}
          >
            {column.label || column.key.replace(/_/g, ' ')}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
