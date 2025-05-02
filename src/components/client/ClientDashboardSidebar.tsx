
import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { ClientSidebarNavigation } from "./ClientSidebarNavigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ClientDashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Sidebar variant="sidebar" collapsible={collapsed ? "icon" : "none"}>
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-siso-border/30">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
            alt="SISO Agency"
            className="h-8 w-8 rounded-xl border border-siso-orange/60 shadow-lg bg-black/40"
          />
          {!collapsed && (
            <span className="ml-3 text-lg font-bold bg-gradient-to-r from-siso-orange to-siso-red bg-clip-text text-transparent">
              SISO Agency
            </span>
          )}
        </div>
        
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-siso-border/20 text-siso-text"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <ClientSidebarNavigation collapsed={collapsed} />
    </Sidebar>
  );
}
