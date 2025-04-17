
import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, GripVertical } from 'lucide-react';
import { ClientColumnPreference } from '@/types/client.types';

interface DraggableColumnHeaderProps {
  column: ClientColumnPreference;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onSort: () => void;
  isSorted: boolean;
  sortDirection?: 'asc' | 'desc';
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  onSort,
  isSorted,
  sortDirection,
}: DraggableColumnHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const [, drop] = useDrop({
    accept: 'column',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Time to actually perform the action
      moveColumn(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      setIsDraggingOver(true);
    },
    drop() {
      setIsDraggingOver(false);
    }
  });
  
  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: () => {
      return { id: column.key, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  drag(drop(ref));
  
  return (
    <div 
      ref={ref} 
      className={`flex items-center font-semibold ${isDragging ? 'opacity-50' : ''} ${isDraggingOver ? 'bg-primary/10' : ''}`}
    >
      <div className="pr-2 cursor-move">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Button 
        variant="ghost" 
        onClick={onSort} 
        className="flex items-center hover:bg-transparent p-0"
      >
        <span className="capitalize">{column.label || column.key.replace(/_/g, ' ')}</span>
        {isSorted && (
          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
        )}
      </Button>
    </div>
  );
}
