import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Circle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DailyTrackerTaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  dueDate?: string;
  logField?: string;
  logValue?: string;
  onToggle: (id: string) => void;
  onUpdate?: (id: string, field: string, value: any) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  color?: 'yellow' | 'purple' | 'green' | 'red' | 'pink' | 'indigo' | 'orange' | 'blue';
  className?: string;
}

const priorityConfig = {
  low: {
    color: 'border-green-500/50 text-green-400 bg-green-500/10',
    icon: <Circle className="h-3 w-3" />
  },
  medium: {
    color: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10',
    icon: <Clock className="h-3 w-3" />
  },
  high: {
    color: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
    icon: <AlertCircle className="h-3 w-3" />
  },
  urgent: {
    color: 'border-red-500/50 text-red-400 bg-red-500/10',
    icon: <AlertCircle className="h-3 w-3 animate-pulse" />
  }
};

const colorConfig = {
  yellow: 'bg-yellow-900/10 border-yellow-700/30 hover:bg-yellow-900/15',
  purple: 'bg-purple-900/10 border-purple-700/30 hover:bg-purple-900/15',
  green: 'bg-green-900/10 border-green-700/30 hover:bg-green-900/15',
  red: 'bg-red-900/10 border-red-700/30 hover:bg-red-900/15',
  pink: 'bg-pink-900/10 border-pink-700/30 hover:bg-pink-900/15',
  indigo: 'bg-indigo-900/10 border-indigo-700/30 hover:bg-indigo-900/15',
  orange: 'bg-orange-900/10 border-orange-700/30 hover:bg-orange-900/15',
  blue: 'bg-blue-900/10 border-blue-700/30 hover:bg-blue-900/15'
};

export const DailyTrackerTaskItem: React.FC<DailyTrackerTaskItemProps> = ({
  id,
  title,
  completed,
  description,
  priority,
  category,
  dueDate,
  logField,
  logValue,
  onToggle,
  onUpdate,
  onDelete,
  editable = false,
  variant = 'default',
  color = 'yellow',
  className
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(title);

  const handleSaveEdit = () => {
    if (onUpdate && editTitle.trim()) {
      onUpdate(id, 'title', editTitle);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  if (variant === 'compact') {
    return (
      <motion.div
        className={cn(
          'flex items-center space-x-2 p-2 rounded-md transition-colors',
          colorConfig[color],
          completed && 'opacity-60',
          className
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 5 }}
      >
        <Checkbox
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className={cn(
            'border-gray-600',
            completed && 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600'
          )}
        />
        <span className={cn(
          'text-sm text-gray-200 flex-1',
          completed && 'line-through'
        )}>
          {title}
        </span>
        {priority && (
          <Badge 
            variant="outline" 
            className={cn('text-xs px-1.5 py-0', priorityConfig[priority].color)}
          >
            {priority}
          </Badge>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        'p-3 sm:p-4 rounded-lg border transition-all',
        colorConfig[color],
        completed && 'opacity-70',
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={completed}
          onCheckedChange={() => onToggle(id)}
          className={cn(
            'mt-1 border-gray-600',
            completed && 'data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600'
          )}
        />
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="flex items-start justify-between">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-gray-600 text-white text-sm sm:text-base"
                autoFocus
              />
            ) : (
              <h4 className={cn(
                'font-medium text-sm sm:text-base',
                completed ? 'text-gray-400 line-through' : 'text-white'
              )}>
                {title}
              </h4>
            )}

            {(editable || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  {editable && (
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(id)}
                      className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {priority && (
              <Badge 
                variant="outline" 
                className={cn('text-xs flex items-center gap-1', priorityConfig[priority].color)}
              >
                {priorityConfig[priority].icon}
                {priority}
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400 bg-blue-500/10">
                {category}
              </Badge>
            )}
            {dueDate && (
              <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-400 bg-gray-500/10">
                <Clock className="h-3 w-3 mr-1" />
                {dueDate}
              </Badge>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className={cn(
              'text-xs sm:text-sm leading-relaxed',
              completed ? 'text-gray-500' : 'text-gray-300'
            )}>
              {description}
            </p>
          )}

          {/* Log field */}
          {logField && (
            <div className="mt-3 space-y-1">
              <label className="text-xs text-gray-400">{logField}</label>
              <Input
                value={logValue || ''}
                onChange={(e) => onUpdate?.(id, 'logValue', e.target.value)}
                placeholder="Enter value..."
                className="bg-gray-700/50 border-gray-600 text-white text-sm h-8"
                disabled={completed}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Task list wrapper component
export const DailyTrackerTaskList: React.FC<{
  tasks: Array<Omit<DailyTrackerTaskItemProps, 'onToggle' | 'onUpdate' | 'onDelete'>>;
  onToggle: (id: string) => void;
  onUpdate?: (id: string, field: string, value: any) => void;
  onDelete?: (id: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  color?: DailyTrackerTaskItemProps['color'];
  emptyMessage?: string;
  className?: string;
}> = ({ 
  tasks, 
  onToggle, 
  onUpdate, 
  onDelete, 
  variant = 'default',
  color,
  emptyMessage = 'No tasks yet',
  className 
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      variant === 'compact' ? 'space-y-1' : 'space-y-3',
      className
    )}>
      {tasks.map((task, index) => (
        <DailyTrackerTaskItem
          key={task.id}
          {...task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          variant={variant}
          color={color}
        />
      ))}
    </div>
  );
};

export default DailyTrackerTaskItem;