
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
        default: "border border-border/20 rounded-md overflow-hidden",
        striped: "[&_tr:nth-child(even)]:bg-muted/5 border border-border/20 rounded-md overflow-hidden"
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
    "align-middle text-left box-border",
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
    "border-b border-border/10",
    "outline-none focus-within:bg-blue-50/5 focus-within:outline-blue-500/20"
  ].join(" "),
  {
    variants: {
      interactive: {
        true: "cursor-pointer hover:bg-muted/10",
        false: ""
      }
    },
    defaultVariants: {
      interactive: true
    }
  }
);
