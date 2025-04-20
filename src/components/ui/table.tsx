
import * as React from "react"
import { cn } from "@/lib/utils"
import { tableStyles, tableCellStyles, tableRowStyles } from "./table-styles"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    variant?: "default" | "striped";
    size?: "default" | "sm" | "lg";
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(tableStyles({ variant, size }), className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "bg-muted/50 backdrop-blur-sm sticky top-0 z-20 border-b border-border/30",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/30 backdrop-blur-sm font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    interactive?: boolean;
    isSelected?: boolean;
  }
>(({ className, interactive = true, isSelected, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      tableRowStyles({ interactive }),
      isSelected && "bg-muted/20",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    align?: "left" | "center" | "right";
  }
>(({ className, align = "left", ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-3 py-2 text-xs font-medium text-muted-foreground tracking-wider uppercase",
      "border-r border-border/10 last:border-r-0",
      "transition-colors whitespace-nowrap",
      tableCellStyles({ align }),
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    align?: "left" | "center" | "right";
    isEditing?: boolean;
  }
>(({ className, align = "left", isEditing, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 border-r border-border/10 last:border-r-0 relative",
      isEditing ? "p-0 bg-muted/30" : "p-2",
      tableCellStyles({ align }),
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
