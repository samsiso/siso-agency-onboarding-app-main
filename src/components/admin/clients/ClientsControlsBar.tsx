
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ViewModeSwitcher } from "./ViewModeSwitcher";

interface ClientsControlsBarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
}

export function ClientsControlsBar({
  statusFilter,
  onStatusFilterChange,
  viewMode,
  setViewMode,
}: ClientsControlsBarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-2 px-2 py-3 bg-white/80 backdrop-blur rounded-lg border border-border/30 shadow-sm mb-4 w-full">
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="border-border/40 bg-white/80 min-w-[140px]">
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
        <div>
          <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
      {/* Filler for future controls if wanted */}
      <div />
    </div>
  );
}
