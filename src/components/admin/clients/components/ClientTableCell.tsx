
import React from 'react';
import { Input } from '@/components/ui/input';
import { ClientData } from '@/types/client.types';
import { FileText, Link, DollarSign, CalendarClock } from 'lucide-react';
import { EnhancedStatusBadge } from '../EnhancedStatusBadge';
import { ClientSelectField } from '../ClientSelectField';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { tableCellStyles } from '@/components/ui/table-styles';

const COMPANY_NICHE_OPTIONS = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'agency', label: 'Agency' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' }
];

interface ClientTableCellProps {
  client: ClientData;
  columnKey: string;
  isEditing: boolean;
  editValue: string;
  editInputRef: React.RefObject<HTMLInputElement>;
  onEditValueChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onDoubleClick: () => void;
  onSaveEdit: (params: { id: string; field: string; value: string }) => void;
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
  onSaveEdit
}: ClientTableCellProps) {
  const renderEditableContent = () => (
    <Input
      ref={editInputRef}
      value={editValue}
      onChange={(e) => onEditValueChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="h-8 min-w-[120px] border-border/50"
      autoFocus
    />
  );

  // Helper function to safely render values
  const safeRender = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (Array.isArray(value)) {
      return `${value.length} items`;
    }
    
    return String(value);
  };

  switch (columnKey) {
    
    case 'full_name':
      return (
        <div className="flex flex-col space-y-0.5" title={client.full_name || ''}>
          {isEditing ? renderEditableContent() : (
            <div onDoubleClick={onDoubleClick}>
              <span className="font-medium text-foreground">{client.full_name || 'Unknown'}</span>
              {client.email && <span className="block text-xs text-muted-foreground">{client.email}</span>}
            </div>
          )}
        </div>
      );

    case 'status':
      return <EnhancedStatusBadge status={client.status} />;

    case 'company_niche':
      return (
        <ClientSelectField
          value={client.company_niche || 'other'}
          onChange={(value) => onSaveEdit({ id: client.id, field: 'company_niche', value })}
          options={COMPANY_NICHE_OPTIONS}
          className="h-8 min-w-[120px]"
        />
      );

    case 'updated_at':
      return <>{formatRelativeTime(client.updated_at)}</>;

    case 'notion_plan_url':
      return client.notion_plan_url ? (
        <a 
          href={client.notion_plan_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center"
        >
          <FileText className="h-4 w-4 mr-1" />
          Notion Plan
        </a>
      ) : '-';

    case 'estimated_price':
      return client.estimated_price 
        ? <span className="flex items-center"><DollarSign className="h-4 w-4" />{client.estimated_price.toLocaleString()}</span> 
        : '-';

    case 'development_url':
      return client.development_url ? (
        <a 
          href={client.development_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center"
        >
          <Link className="h-4 w-4 mr-1" />
          View Site
        </a>
      ) : '-';

    case 'next_steps':
    case 'key_research':
      return (
        <div className="max-w-xs truncate" title={client[columnKey as keyof ClientData]?.toString() || ''}>
          {isEditing ? renderEditableContent() : (
            <div onDoubleClick={onDoubleClick}>
              {client[columnKey as keyof ClientData] || '-'}
            </div>
          )}
        </div>
      );

    case 'estimated_completion_date':
      return client.estimated_completion_date ? (
        <div className="flex items-center">
          <CalendarClock className="h-4 w-4 mr-1" />
          {new Date(client.estimated_completion_date).toLocaleDateString()}
        </div>
      ) : '-';

    case 'todos':
      if (!client.todos || client.todos.length === 0) {
        return <span>-</span>;
      }
      const pendingTodos = Array.isArray(client.todos) ? client.todos.filter(t => !t.completed).length : 0;
      return (
        <div className="flex items-center">
          <span className="bg-blue-500/10 text-blue-500 rounded-full px-2 py-0.5 text-xs">
            {pendingTodos} pending
          </span>
        </div>
      );

    default:
      const value = client[columnKey as keyof ClientData];
      if (isEditing) {
        return renderEditableContent();
      } else {
        // Use the safeRender function to ensure proper rendering
        return (
          <div onDoubleClick={onDoubleClick}>
            {safeRender(value)}
          </div>
        );
      }
  }
}

// Regular TableCell component without the custom props needed only for the client table cell
export function TableCell({ 
  children,
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        tableCellStyles(),
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
