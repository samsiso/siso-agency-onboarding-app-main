
import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, LinkProps } from "react-router-dom";

/* --- Sidebar Types --- */
interface Links {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  const { className, children, ...otherProps } = props;
  
  return (
    <>
      <DesktopSidebar className={className} {...otherProps}>
        {children}
      </DesktopSidebar>
      <MobileSidebar>{children}</MobileSidebar>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  
  // Define the width as a string to avoid the type error
  const widthStyle = animate ? (open ? "300px" : "76px") : "300px";

  return (
    <motion.div
      className={cn(
        // Glass + shadow + border for glassmorphism
        "h-full hidden md:flex md:flex-col bg-[#18141e]/80 backdrop-blur-md border-r border-siso-border shadow-xl transition-all",
        "w-[300px] flex-shrink-0 px-3 py-6 relative z-10",
        className,
        open ? "sidebar-open" : "sidebar-collapsed"
      )}
      style={{ width: widthStyle, minWidth: widthStyle }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-[#18141e]/90 backdrop-blur-md w-full z-20 border-b border-siso-border"
      )}
    >
      <div className="flex justify-end z-20 w-full">
        <Menu
          className="text-neutral-200 cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-[#18141e] dark:bg-[#18141e] backdrop-blur-xl p-8 z-[100] flex flex-col justify-between"
            )}
          >
            <div
              className="absolute right-8 top-8 z-50 text-white cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <X />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* SidebarLink with orange left bar for active */
export const SidebarLink = ({
  link,
  active,
  className,
  ...props
}: {
  link: Links;
  active?: boolean;
  className?: string;
} & Partial<LinkProps>) => {
  const { open, animate } = useSidebar();
  // Calculate link styles based on state
  const linkStyles = open
    ? {
        minHeight: 48,
        paddingLeft: active ? 16 : 12,
        fontWeight: active ? 600 : 500,
        color: active ? "#FFA726" : "",
        borderLeft: active ? "4px solid #FFA726" : "4px solid transparent",
        boxShadow: active
          ? "0 0 14px 1px rgba(255,167,38,0.12)"
          : undefined,
      }
    : {
        minHeight: 48,
      };
  
  // Left bar highlight, glowing if active
  return (
    <Link
      to={link.href}
      className={cn(
        "group/sidebar flex items-center gap-3 rounded-xl px-3 py-3 mb-1 transition-all cursor-pointer relative font-medium",
        active
          ? "bg-orange-500/10 shadow-[0_2px_10px_0_rgba(255,166,38,0.07)]"
          : "hover:bg-siso-orange/5 hover:text-siso-orange",
        className,
        open ? "justify-start" : "justify-center"
      )}
      style={linkStyles}
      {...props}
    >
      <span
        className={cn(
          open
            ? ""
            : "flex items-center justify-center w-full",
          "transition-colors"
        )}
      >
        {link.icon}
      </span>
      {open && (
        <span className="text-siso-text text-base transition-all duration-200 whitespace-pre ml-1">
          {link.label}
        </span>
      )}
    </Link>
  );
};

