
import React, { useState } from "react";
import { ClientSidebarNavigation } from "./ClientSidebarNavigation";

export function ClientDashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 flex flex-col transition-all duration-300 bg-siso-bg border-r border-siso-border min-h-screen`}>
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {collapsed ? (
              <>
                <path d="M9 18l6-6-6-6" />
              </>
            ) : (
              <>
                <path d="M15 18l-6-6 6-6" />
              </>
            )}
          </svg>
        </button>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <ClientSidebarNavigation collapsed={collapsed} />
      </div>
    </aside>
  );
}
