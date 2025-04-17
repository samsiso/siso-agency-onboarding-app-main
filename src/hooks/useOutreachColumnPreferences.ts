
import { useState, useCallback } from 'react';

interface OutreachColumnPreference {
  key: string;
  label: string;
  visible: boolean;
  width?: number;
  pinned?: boolean;
}

export const useOutreachColumnPreferences = (initialColumns: OutreachColumnPreference[]) => {
  const [columns, setColumns] = useState<OutreachColumnPreference[]>(initialColumns);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAllColumns, setShowAllColumns] = useState(false);
  
  const toggleShowAllColumns = useCallback(() => {
    setShowAllColumns(!showAllColumns);
  }, [showAllColumns]);
  
  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    const newColumns = [...columns];
    const draggedColumn = newColumns[dragIndex];
    
    // Remove the dragged column from the array
    newColumns.splice(dragIndex, 1);
    
    // Insert the dragged column at the new position
    newColumns.splice(hoverIndex, 0, draggedColumn);
    
    setColumns(newColumns);
  }, [columns]);
  
  return {
    columns,
    setColumns,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    showAllColumns,
    toggleShowAllColumns,
    moveColumn
  };
};
