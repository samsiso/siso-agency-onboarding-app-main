
import { cva } from "class-variance-authority";

export const tableStyles = cva(
  "w-full relative bg-transparent border-collapse",
  {
    variants: {
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base"
      },
      variant: {
        default: "border-border/20 [&_tr:last-child]:border-0",
        striped: "[&_tr:nth-child(even)]:bg-muted/5"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

export const tableCellStyles = cva(
  [
    "p-4 align-middle text-left",
    "[&:has([role=checkbox])]:pr-0",
    "[&>a]:text-primary [&>a]:hover:underline",
    "whitespace-nowrap overflow-hidden text-ellipsis",
    "transition-colors duration-200"
  ].join(" "),
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right"
      }
    },
    defaultVariants: {
      align: "left"
    }
  }
);

export const tableRowStyles = cva(
  [
    "border-b border-border/20 transition-colors duration-200",
    "hover:bg-muted/5",
    "data-[state=selected]:bg-muted/10"
  ].join(" "),
  {
    variants: {
      interactive: {
        true: "cursor-pointer"
      }
    },
    defaultVariants: {
      interactive: true
    }
  }
);
