
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/aceternitySidebar";
import {
  LayoutDashboard,
  Folder,
  List,
  Clock,
  FileText,
  File,
  DollarSign,
  UserCog,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Sidebar with Glassmorphism, logo, bold highlight for active, collapsible.
 */
export function ClientDashboardSidebar() {
  const [open, setOpen] = useState(true); // Open by default for desktop
  const navigate = useNavigate();
  const location = useLocation();

  // Helper for active route highlighting
  const isActive = (href: string) => {
    const cur = location.pathname.replace(/\/$/, "");
    const tgt = href.replace(/\/$/, "");
    return cur === tgt || cur.startsWith(tgt + "/");
  };

  // Sidebar sections
  const links = [
    {
      label: "Dashboard",
      href: "/client-dashboard",
      icon: (
        <LayoutDashboard className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Projects",
      href: "/client-dashboard/projects",
      icon: (
        <Folder className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Todo List",
      href: "/client-dashboard/tasks",
      icon: (
        <List className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Timeline",
      href: "/client-dashboard/timeline",
      icon: (
        <Clock className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Changelog",
      href: "/client-dashboard/changelog",
      icon: (
        <FileText className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Documents",
      href: "/client-dashboard/documents",
      icon: (
        <File className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Financial",
      href: "/client-dashboard/financial",
      icon: (
        <DollarSign className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/client-dashboard/profile",
      icon: (
        <UserCog className="text-siso-text group-hover/sidebar:text-siso-orange h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between h-full">
        {/* Logo at Top */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center w-full pb-6 mb-4 border-b border-white/10 justify-center">
            <a
              href="/client-dashboard"
              onClick={e => {
                e.preventDefault();
                navigate("/client-dashboard");
              }}
              className={cn(
                "flex items-center gap-2 px-2 py-0 text-siso-text-bold hover:text-siso-orange group transition",
                open ? "" : "justify-center"
              )}
              aria-label="Client Dashboard Home"
              tabIndex={0}
            >
              <img
                src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
                className="h-9 w-9 rounded-xl border border-siso-orange/60 shadow-lg bg-black/40"
                alt="Logo"
              />
              <motion.span
                initial={false}
                animate={{
                  opacity: open ? 1 : 0,
                  display: open ? "inline-block" : "none",
                }}
                className="ml-1 font-bold text-lg tracking-tight transition"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#FFA726",
                  letterSpacing: "-0.02em"
                }}
              >
                Client Portal
              </motion.span>
            </a>
          </div>
          <div className="flex flex-col flex-1 gap-1">
            {links.map((link, idx) => (
              <SidebarLink
                key={link.label}
                link={link}
                active={isActive(link.href)}
                onClick={e => {
                  e.preventDefault();
                  navigate(link.href);
                }}
              />
            ))}
          </div>
        </div>
        {/* Logout at Bottom */}
        <div className="pt-6 mt-4 border-t border-white/10">
          <SidebarLink
            link={{
              label: "Logout",
              href: "/client-portal",
              icon: (
                <LogOut className="text-siso-text group-hover/sidebar:text-red-400 h-5 w-5 flex-shrink-0" />
              ),
            }}
            active={isActive("/client-portal")}
            onClick={e => {
              e.preventDefault();
              navigate("/client-portal");
            }}
            className="hover:bg-red-600/10 hover:text-red-400"
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
