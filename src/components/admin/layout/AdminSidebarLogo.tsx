import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

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
    <Link to={href} className={cn("flex items-center", className)}>
      {children}
    </Link>
  );
};

export default function AdminSidebarLogo({
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
            SISO <span className="font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">ADMIN</span>
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
            SISO ADMIN
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
