
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { TimelineDemo } from "@/components/ui/timeline.demo";

export default function ChangelogPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-black via-[#18181b] to-[#09090a]">
        <Sidebar />
        <main className="flex-1 relative py-10 px-2 md:px-12 bg-transparent">
          <div className="max-w-5xl mx-auto mt-6 glass-morphism rounded-xl shadow-lg border border-white/10">
            <TimelineDemo />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
