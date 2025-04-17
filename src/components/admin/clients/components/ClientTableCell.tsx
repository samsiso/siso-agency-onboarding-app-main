
import React from 'react';
import { Input } from '@/components/ui/input';
import { ClientData } from '@/types/client.types';
import { BasicCell } from './table-cells/BasicCell';
import { StatusCell } from './table-cells/StatusCell';
import { TodosCell } from './table-cells/TodosCell';
import { LinkCell } from './table-cells/LinkCell';
import { DateCell } from './table-cells/DateCell';
import { DollarSign } from 'lucide-react';

interface ClientTableCellProps {
  client: ClientData;
  columnKey: string;
  isEditing: boolean;
  editValue: string;
  editInputRef: React.RefObject<HTMLInputElement>;
  onEditValueChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDoubleClick: () => void;
}

export function ClientTableCell({
  client,
  columnKey,
  isEditing,
  editValue,
  editInputRef,
  onEditValueChange,
  onKeyDown,
  onDoubleClick,
}: ClientTableCellProps) {
  if (isEditing) {
    return (
      <Input
        ref={editInputRef}
        value={editValue}
        onChange={(e) => onEditValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="h-8 min-w-[120px] border-border/50"
        autoFocus
      />
    );
  }

  const renderContent = () => {
    switch (columnKey) {
      case 'full_name':
        return (
          <div className="flex flex-col space-y-0.5" title={client.full_name || ''} onDoubleClick={onDoubleClick}>
            <span className="font-medium text-foreground">{client.full_name || 'Unknown'}</span>
            {client.email && <span className="block text-xs text-muted-foreground">{client.email}</span>}
          </div>
        );

      case 'status':
        return <StatusCell status={client.status} />;

      case 'todos':
        return <TodosCell todos={client.todos} />;

      case 'notion_plan_url':
        return <LinkCell url={client.notion_plan_url} label="Notion Plan" icon="file" />;

      case 'development_url':
        return <LinkCell url={client.development_url} label="View Site" />;

      case 'estimated_price':
        if (!client.estimated_price) return <span>-</span>;
        return (
          <span className="flex items-center">
            <DollarSign className="h-4 w-4" />
            {client.estimated_price.toLocaleString()}
          </span>
        );

      case 'updated_at':
      case 'initial_contact_date':
      case 'start_date':
      case 'estimated_completion_date':
        return (
          <DateCell 
            date={client[columnKey]} 
            showIcon={columnKey === 'estimated_completion_date'} 
          />
        );

      case 'next_steps':
      case 'key_research':
        return (
          <div className="max-w-xs truncate" title={client[columnKey]?.toString() || ''} onDoubleClick={onDoubleClick}>
            <BasicCell value={client[columnKey]} />
          </div>
        );

      default:
        return (
          <div onDoubleClick={onDoubleClick}>
            <BasicCell value={client[columnKey as keyof ClientData]} />
          </div>
        );
    }
  };

  return renderContent();
}

// Export TableCell separately as it's a different component
export { TableCell } from '@/components/ui/table';
