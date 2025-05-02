
import React from "react";

// This Sidebar now just shows a message to the developer/team.
// You can update this later to add your own links or logic if you want.
export function ClientDashboardSidebar() {
  return (
    <aside className="w-60 md:w-60 flex-shrink-0 flex flex-col justify-center items-center p-6 bg-siso-bg border-r border-siso-border min-h-screen">
      <div className="flex flex-col gap-4 items-center justify-center">
        <img
          src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
          alt="Logo"
          className="h-10 w-10 rounded-xl border border-siso-orange/60 shadow-lg bg-black/40 mb-2"
        />
        <div className="text-siso-text-bold text-lg font-bold text-center">
          Client Sidebar Removed
        </div>
        <div className="text-siso-text text-xs text-center opacity-70">
          You can add your sidebar links and navigation here.<br />
          (aceternitySidebar was removed.)
        </div>
      </div>
    </aside>
  );
}
