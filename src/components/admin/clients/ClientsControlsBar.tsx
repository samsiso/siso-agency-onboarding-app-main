
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ClientViewPreference } from "@/types/client.types";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

interface ClientsControlsBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
}

export function ClientsControlsBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  setViewMode,
}: ClientsControlsBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-2 py-3 bg-white/70 backdrop-blur rounded-lg border border-border/40 shadow-sm mb-2 w-full">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-10 border-border/40 bg-white/90"
          />
        </div>
        <div className="min-w-[135px]">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="border-border/40 bg-white/90">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end mt-2 md:mt-0">
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </div>
  );
}
