// File: components/[category]/ComponentName.tsx
import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

/**
 * Props interface for ComponentName
 * @interface ComponentNameProps
 */
interface ComponentNameProps {
  /** Primary title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional Lucide icon */
  icon?: LucideIcon;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Child components */
  children?: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Variant styling */
  variant?: 'default' | 'outlined' | 'ghost';
  /** Size variants */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ComponentName - A reusable component with dark theme
 * 
 * @param props - Component props
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * import { User } from 'lucide-react';
 * 
 * <ComponentName
 *   title="Sample Title"
 *   description="Sample description"
 *   icon={User}
 *   onClick={() => console.log('Clicked')}
 * />
 * ```
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className,
  children,
  isLoading = false,
  disabled = false,
  variant = 'default',
  size = 'md'
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-900 border-gray-700 hover:bg-gray-800',
    outlined: 'bg-transparent border-gray-600 hover:bg-gray-800/50',
    ghost: 'bg-transparent border-transparent hover:bg-gray-800/30'
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div 
      className={cn(
        // Base styles
        'border rounded-lg transition-all duration-200',
        'focus-within:ring-2 focus-within:ring-orange-500/20',
        
        // Variant styles
        variantStyles[variant],
        
        // Size styles
        sizeStyles[size],
        
        // Interactive styles
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        
        // Loading styles
        isLoading && 'opacity-70',
        
        className
      )}
      onClick={!disabled && !isLoading ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Header section */}
      <div className="flex items-center gap-3">
        {/* Icon with loading state */}
        {Icon && (
          <div className="flex-shrink-0">
            {isLoading ? (
              <div className={cn(
                "animate-spin rounded-full border-2 border-gray-600 border-t-orange-500",
                iconSizes[size]
              )} />
            ) : (
              <Icon className={cn(
                "text-orange-500",
                iconSizes[size]
              )} />
            )}
          </div>
        )}
        
        {/* Title */}
        <h3 className={cn(
          "text-white font-semibold flex-1",
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-base',
          size === 'lg' && 'text-lg'
        )}>
          {title}
        </h3>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="text-gray-400 text-sm">
            Loading...
          </div>
        )}
      </div>
      
      {/* Description */}
      {description && (
        <p className={cn(
          "text-gray-300 mt-2",
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}>
          {description}
        </p>
      )}
      
      {/* Children content */}
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
};

// Export default for easier imports
export default ComponentName;

// Usage examples and patterns
export const ComponentNameExamples = {
  // Basic usage
  Basic: () => (
    <ComponentName title="Basic Component" />
  ),
  
  // With icon and description  
  WithIcon: () => {
    // Import icon: import { User } from 'lucide-react';
    return (
      <ComponentName
        title="User Profile"
        description="Manage your account settings"
        // icon={User}
      />
    );
  },
  
  // Interactive component
  Interactive: () => (
    <ComponentName
      title="Click Me"
      description="This component responds to clicks"
      onClick={() => alert('Clicked!')}
    />
  ),
  
  // Loading state
  Loading: () => (
    <ComponentName
      title="Loading Component"
      isLoading={true}
    />
  ),
  
  // Different variants
  Variants: () => (
    <div className="space-y-4">
      <ComponentName title="Default" variant="default" />
      <ComponentName title="Outlined" variant="outlined" />
      <ComponentName title="Ghost" variant="ghost" />
    </div>
  ),
  
  // Different sizes
  Sizes: () => (
    <div className="space-y-4">
      <ComponentName title="Small" size="sm" />
      <ComponentName title="Medium" size="md" />
      <ComponentName title="Large" size="lg" />
    </div>
  )
}; 