
import React, { useState } from "react";
import { ClientSidebarNavigation } from "./ClientSidebarNavigation";
import { ChevronDown, User, HelpCircle, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { SidebarProvider, SidebarContent } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ClientDashboardSidebar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: project } = useProjects();
  
  return (
    <SidebarProvider defaultOpen={true}>
      <aside className="w-64 flex-shrink-0 flex flex-col h-screen bg-siso-bg border-r border-siso-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center justify-center border-b border-siso-border">
            <img
              src="/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
              alt="SISO Agency"
              className="h-10 w-10 rounded-xl border border-siso-orange/60 shadow-lg bg-black/40"
            />
            <span className="ml-3 text-siso-text-bold text-lg font-bold">SISO Agency</span>
          </div>
          
          {/* Project Selection Dropdown */}
          <div className="p-4 border-b border-siso-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-siso-bg-alt border-siso-border">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Briefcase className="h-4 w-4 flex-shrink-0 text-siso-orange" />
                    <span className="truncate text-siso-text">
                      {project ? project.name : "Select a Project"}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-siso-bg-alt border-siso-border">
                {project ? (
                  <DropdownMenuItem className="text-siso-text">{project.name}</DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-siso-text-muted">No projects available</DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-siso-border" />
                <DropdownMenuItem 
                  className="text-siso-text"
                  onClick={() => navigate('/client-dashboard/projects')}
                >
                  View all projects
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto py-2">
            <ClientSidebarNavigation collapsed={!sidebarOpen} onItemClick={() => {}} visible={true} />
          </div>
          
          {/* User Dropdown */}
          <div className="p-4 border-t border-siso-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-2 hover:bg-siso-bg-alt">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-siso-border">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-siso-bg-alt text-siso-orange">UC</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium text-siso-text">ubahcrypto</span>
                      <span className="text-xs text-siso-text-muted">Client</span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-siso-bg-alt border-siso-border">
                <DropdownMenuItem className="text-siso-text" onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-siso-text" onClick={() => navigate('/resources')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-siso-text" onClick={() => navigate('/resources/documents')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Document Library</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-siso-border" />
                <DropdownMenuItem className="text-siso-text">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </SidebarProvider>
  );
}
