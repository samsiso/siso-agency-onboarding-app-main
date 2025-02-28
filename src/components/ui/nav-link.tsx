
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface NavLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
  active?: boolean;
  disabled?: boolean;
}

// [Analysis] NavLink component that allows smooth scrolling to anchors
export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, children, variant = "ghost", active, disabled, ...props }, ref) => {
    const isAnchorLink = href.startsWith("#");

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      
      if (isAnchorLink) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
          
          // Update URL without reload
          window.history.pushState(null, "", href);
        }
      }
      
      if (props.onClick) {
        props.onClick(e);
      }
    };

    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
            "bg-background hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
          },
          active && "bg-accent text-accent-foreground",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }
);

NavLink.displayName = "NavLink";
