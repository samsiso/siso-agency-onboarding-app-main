
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ClientViewPreference } from '@/types/client.types';
import { Settings2 } from 'lucide-react';

interface ViewOptionsMenuProps {
  viewPreference: ClientViewPreference;
  onViewPreferenceChange: (preference: Partial<ClientViewPreference>) => void;
}

export function ViewOptionsMenu({
  viewPreference,
  onViewPreferenceChange
}: ViewOptionsMenuProps) {
  
  const handleColumnToggle = (columnKey: string) => {
    const newColumns = viewPreference.columns.map(col => {
      if (col.key === columnKey) {
        return { ...col, visible: !col.visible };
      }
      return col;
    });
    
    onViewPreferenceChange({ columns: newColumns });
  };
  
  const handlePageSizeChange = (size: number) => {
    onViewPreferenceChange({ pageSize: size });
  };
  
  const handleSortChange = (column: string, direction: 'asc' | 'desc') => {
    onViewPreferenceChange({
      sortColumn: column,
      sortDirection: direction
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Settings2 className="mr-2 h-4 w-4" />
          View Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>Customize View</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <div className="max-h-[200px] overflow-y-auto">
          {viewPreference.columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.key}
              checked={column.visible}
              onCheckedChange={() => handleColumnToggle(column.key)}
              className="capitalize"
            >
              {column.key.replace(/_/g, ' ')}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <div className="px-2 py-1.5 grid grid-cols-2 gap-1">
          {viewPreference.columns.filter(c => c.visible).map((column) => (
            <div key={column.key} className="flex gap-1">
              <Button
                variant={viewPreference.sortColumn === column.key && viewPreference.sortDirection === 'asc' ? 'default' : 'outline'}
                size="sm"
                className="w-full h-8 text-xs capitalize"
                onClick={() => handleSortChange(column.key, 'asc')}
              >
                {column.key.replace(/_/g, ' ')} ↑
              </Button>
              <Button
                variant={viewPreference.sortColumn === column.key && viewPreference.sortDirection === 'desc' ? 'default' : 'outline'}
                size="sm"
                className="w-full h-8 text-xs capitalize"
                onClick={() => handleSortChange(column.key, 'desc')}
              >
                {column.key.replace(/_/g, ' ')} ↓
              </Button>
            </div>
          ))}
        </div>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Page Size</DropdownMenuLabel>
        <div className="px-2 py-1.5 grid grid-cols-3 gap-1">
          {[5, 10, 20, 50, 100].map((size) => (
            <Button
              key={size}
              variant={viewPreference.pageSize === size ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => handlePageSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
