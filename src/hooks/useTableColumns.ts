
import { useState } from 'react';

export interface TableColumn {
  key: string;
  label: string;
  visible: boolean;
}

export function useTableColumns(initialColumns: TableColumn[]) {
  const [columns, setColumns] = useState(initialColumns);

  const updateColumnVisibility = (updatedColumns: TableColumn[]) => {
    setColumns(updatedColumns);
  };

  const visibleColumns = columns.filter(col => col.visible);

  return {
    columns,
    visibleColumns,
    updateColumnVisibility
  };
}
