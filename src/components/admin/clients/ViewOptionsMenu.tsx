
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
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function ViewOptionsMenu({
  pageSize,
  onPageSizeChange
}: ViewOptionsMenuProps) {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Settings2 className="h-4 w-4 mr-2" />
          View Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Customize View</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Page Size</DropdownMenuLabel>
        <div className="px-2 py-1.5 grid grid-cols-3 gap-1">
          {[5, 10, 20, 50, 100].map((size) => (
            <Button
              key={size}
              variant={pageSize === size ? 'default' : 'outline'}
              size="sm"
              className="h-8"
              onClick={() => onPageSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
