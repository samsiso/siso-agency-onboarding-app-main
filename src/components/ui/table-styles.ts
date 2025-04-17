
import { cva } from "class-variance-authority";

export const tableStyles = cva(
  "w-full relative",
  {
    variants: {
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg"
      },
      variant: {
        default: "bg-background border-border/50",
        striped: "even:bg-muted/30"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

export const tableCellStyles = cva(
  "relative p-3 align-middle [&:has([role=checkbox])]:pr-0",
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
  "border-b border-border/50 transition-colors",
  {
    variants: {
      interactive: {
        true: "hover:bg-muted/40 data-[state=selected]:bg-muted/20"
      }
    },
    defaultVariants: {
      interactive: true
    }
  }
);
