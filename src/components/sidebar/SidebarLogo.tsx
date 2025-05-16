import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";

const logoVariants = cva("transition-all", {
  variants: {
    expanded: {
      true: "w-40 justify-start",
      false: "w-10 justify-center",
    },
  },
  defaultVariants: {
    expanded: true,
  },
});

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof logoVariants> {
  expanded?: boolean;
  tooltip?: boolean;
  link?: string;
  className?: string;
}

interface LogoLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

const LogoLink = ({ children, href = "/", className }: LogoLinkProps) => {
  return (
    <Link to={href} className={cn("flex items-center no-underline", className)}>
      {children}
    </Link>
  );
};

export default function SidebarLogo({
  expanded = true,
  tooltip = false,
  link = "/",
  className,
  ...props
}: LogoProps) {
  const Logo = () => (
    <div
      className={cn(
        "flex items-center px-4 py-1.5 min-h-14",
        logoVariants({ expanded }),
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <img 
          src="/images/siso-logo.svg" 
          alt="SISO AGENCY" 
          className="w-9 h-9 dark:invert-0" 
        />
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="ml-2.5 font-semibold text-xl"
          >
            SISO AGENCY
          </motion.span>
        )}
      </motion.div>
    </div>
  );

  if (tooltip && !expanded) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <LogoLink href={link}>
                <Logo />
              </LogoLink>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5} className="bg-primary text-primary-foreground">
            SISO AGENCY
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <LogoLink href={link}>
      <Logo />
    </LogoLink>
  );
}