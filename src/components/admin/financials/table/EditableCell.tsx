
import React, { useState, useRef, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface EditableCellProps {
  value: string | number;
  onChange: (value: string | number) => void;
  onComplete?: () => void;
  type?: 'text' | 'number' | 'currency' | 'date' | 'select';
  options?: Array<{ value: string; label: string }>;
  className?: string;
  align?: "left" | "center" | "right";
  formatter?: (value: any) => string;
  inputClassName?: string;
}

export function EditableCell({
  value,
  onChange,
  onComplete,
  type = 'text',
  options = [],
  className,
  align = 'left',
  formatter = (v) => String(v),
  inputClassName,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // Select all text if it's not a number input
      if (type !== 'number') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleDoubleClick = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitChange();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    commitChange();
  };

  const commitChange = () => {
    if (value !== editValue) {
      onChange(editValue);
    }
    setIsEditing(false);
    onComplete?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === 'number' || type === 'currency' 
      ? parseFloat(e.target.value) || 0 
      : e.target.value;
    
    setEditValue(newValue);
  };

  const formattedValue = (() => {
    if (type === 'currency' && typeof value === 'number') {
      return `£${value.toFixed(2)}`;
    }
    
    return formatter(value);
  })();

  return (
    <TableCell 
      className={cn(
        "cell-editable transition-all",
        isEditing && "cell-editing p-0",
        className
      )} 
      align={align}
      onDoubleClick={handleDoubleClick}
      isEditing={isEditing}
    >
      {isEditing ? (
        <div className="flex items-stretch w-full h-full">
          {type === 'select' ? (
            <select
              value={String(editValue)}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full h-full p-2 focus:outline-none focus:ring-0 border-0 bg-white",
                inputClassName
              )}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <Input
              ref={inputRef}
              type={type === 'currency' ? 'number' : type}
              value={typeof editValue === 'number' && type === 'currency' ? editValue.toString() : editValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              step={type === 'currency' ? '0.01' : undefined}
              className={cn(
                "border-0 shadow-none focus:ring-0 h-full rounded-none",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                inputClassName
              )}
            />
          )}
          
          <div className="flex items-center border-l border-border/20">
            <button 
              onClick={commitChange}
              className="p-1 hover:bg-green-50 text-green-600"
            >
              <Check className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="p-1 hover:bg-red-50 text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-1 py-0.5">{formattedValue}</div>
      )}
    </TableCell>
  );
}
