
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, CheckCircle, Circle, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientColumnPreference } from '@/types/client.types';
import { ColumnCustomizationModal } from './ColumnCustomizationModal';

interface ColumnManagerProps {
  columns: ClientColumnPreference[];
  onColumnsChange: (columns: ClientColumnPreference[]) => void;
}

export function ColumnManager({ columns, onColumnsChange }: ColumnManagerProps) {
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);

  const handleToggleColumn = (key: string) => {
    const newColumns = columns.map(col => {
      if (col.key === key) {
        return { ...col, visible: !col.visible };
      }
      return col;
    });
    
    onColumnsChange(newColumns);
  };
  
  const resetToDefault = () => {
    const defaultColumns = columns.map(col => {
      // Default visible columns
      const defaultVisible = [
        'full_name', 
        'business_name', 
        'status', 
        'project_name', 
        'updated_at'
      ].includes(col.key);
      
      return { ...col, visible: defaultVisible };
    });
    
    onColumnsChange(defaultColumns);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Table Columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {columns.map((column) => (
              <DropdownMenuItem 
                key={column.key}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleColumn(column.key);
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{column.label || column.key.replace(/_/g, ' ')}</span>
                {column.visible ? 
                  <CheckCircle className="h-4 w-4 text-primary" /> : 
                  <Circle className="h-4 w-4 text-muted-foreground" />
                }
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              setIsCustomizationModalOpen(true);
            }}
            className="text-center justify-center font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Customize Columns
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => {
              e.preventDefault();
              resetToDefault();
            }}
            className="text-center justify-center font-medium"
          >
            Reset to Default
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ColumnCustomizationModal
        open={isCustomizationModalOpen}
        onOpenChange={setIsCustomizationModalOpen}
        columns={columns}
        onColumnsChange={onColumnsChange}
      />
    </>
  );
}
