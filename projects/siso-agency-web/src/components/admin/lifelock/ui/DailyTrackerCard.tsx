import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DailyTrackerCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  emoji?: string;
  color: 'yellow' | 'purple' | 'green' | 'red' | 'pink' | 'indigo' | 'orange' | 'blue';
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  progress?: number;
  badge?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  isCompact?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  yellow: {
    card: 'bg-yellow-900/20 border-yellow-700/50 hover:bg-yellow-900/25',
    title: 'text-yellow-400',
    icon: 'text-yellow-500',
    progress: 'bg-yellow-600',
    progressBg: 'bg-yellow-900/30',
    divider: 'border-yellow-600/50'
  },
  purple: {
    card: 'bg-purple-900/20 border-purple-700/50 hover:bg-purple-900/25',
    title: 'text-purple-400',
    icon: 'text-purple-500',
    progress: 'bg-purple-600',
    progressBg: 'bg-purple-900/30',
    divider: 'border-purple-600/50'
  },
  green: {
    card: 'bg-green-900/20 border-green-700/50 hover:bg-green-900/25',
    title: 'text-green-400',
    icon: 'text-green-500',
    progress: 'bg-green-600',
    progressBg: 'bg-green-900/30',
    divider: 'border-green-600/50'
  },
  red: {
    card: 'bg-red-900/20 border-red-700/50 hover:bg-red-900/25',
    title: 'text-red-400',
    icon: 'text-red-500',
    progress: 'bg-red-600',
    progressBg: 'bg-red-900/30',
    divider: 'border-red-600/50'
  },
  pink: {
    card: 'bg-pink-900/20 border-pink-700/50 hover:bg-pink-900/25',
    title: 'text-pink-400',
    icon: 'text-pink-500',
    progress: 'bg-pink-600',
    progressBg: 'bg-pink-900/30',
    divider: 'border-pink-600/50'
  },
  indigo: {
    card: 'bg-indigo-900/20 border-indigo-700/50 hover:bg-indigo-900/25',
    title: 'text-indigo-400',
    icon: 'text-indigo-500',
    progress: 'bg-indigo-600',
    progressBg: 'bg-indigo-900/30',
    divider: 'border-indigo-600/50'
  },
  orange: {
    card: 'bg-orange-900/20 border-orange-700/50 hover:bg-orange-900/25',
    title: 'text-orange-400',
    icon: 'text-orange-500',
    progress: 'bg-orange-600',
    progressBg: 'bg-orange-900/30',
    divider: 'border-orange-600/50'
  },
  blue: {
    card: 'bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/25',
    title: 'text-blue-400',
    icon: 'text-blue-500',
    progress: 'bg-blue-600',
    progressBg: 'bg-blue-900/30',
    divider: 'border-blue-600/50'
  }
};

export const DailyTrackerCard: React.FC<DailyTrackerCardProps> = ({
  title,
  description,
  icon: Icon,
  emoji,
  color,
  children,
  className,
  headerContent,
  progress,
  badge,
  isCompact = false,
  onClick
}) => {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      className={cn('h-full', onClick && 'cursor-pointer')}
      onClick={onClick}
    >
      <Card 
        className={cn(
          colors.card,
          'transition-all duration-200 h-full flex flex-col',
          isCompact && 'shadow-sm',
          !isCompact && 'shadow-lg',
          className
        )}
      >
        <CardHeader className={cn(
          isCompact ? 'p-4 pb-3' : 'p-4 sm:p-6',
          'relative'
        )}>
          {/* Progress bar at top of card */}
          {progress !== undefined && (
            <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden rounded-t-lg">
              <div 
                className={cn('h-full transition-all duration-500', colors.progress)}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={cn(
                'flex items-center gap-2',
                colors.title,
                isCompact ? 'text-base' : 'text-base sm:text-lg'
              )}>
                <Icon className={cn(
                  colors.icon,
                  isCompact ? 'h-4 w-4' : 'h-4 w-4 sm:h-5 sm:w-5'
                )} />
                {emoji && <span>{emoji}</span>}
                <span className="font-semibold">{title}</span>
              </CardTitle>
              
              {description && (
                <CardDescription className={cn(
                  'text-gray-300 mt-2',
                  isCompact ? 'text-xs' : 'text-xs sm:text-sm'
                )}>
                  {description}
                </CardDescription>
              )}
            </div>

            {badge && (
              <Badge 
                variant={badge.variant || 'outline'}
                className={cn(
                  'ml-2',
                  isCompact ? 'text-xs px-2 py-0.5' : 'text-xs sm:text-sm'
                )}
              >
                {badge.label}
              </Badge>
            )}
          </div>

          {headerContent && (
            <>
              <div className={cn('border-t my-3', colors.divider)} />
              {headerContent}
            </>
          )}
        </CardHeader>

        <CardContent className={cn(
          'flex-1',
          isCompact ? 'p-4 pt-0' : 'p-4 sm:p-6 pt-0 sm:pt-0'
        )}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyTrackerCard;