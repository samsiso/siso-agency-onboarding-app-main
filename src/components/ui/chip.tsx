
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-800 text-gray-200",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary-foreground",
        outline: "border border-gray-600 text-gray-300",
        colored: "border border-transparent",
      },
      size: {
        default: "h-6 px-2.5 py-0.5",
        sm: "h-5 px-2 py-0 text-xs",
        lg: "h-7 px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onClose?: () => void;
}

export function Chip({ 
  className, 
  variant, 
  size, 
  onClose, 
  children, 
  ...props 
}: ChipProps) {
  return (
    <div
      className={cn(
        chipVariants({ variant, size }),
        onClose && "pr-1",
        className
      )}
      {...props}
    >
      {children}
      {onClose && (
        <button
          type="button"
          className="ml-1 rounded-full p-0.5 hover:bg-gray-700/50"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  )
}
