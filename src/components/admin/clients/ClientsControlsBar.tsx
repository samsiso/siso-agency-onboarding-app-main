
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ViewModeSwitcher } from "./ViewModeSwitcher";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ClientsControlsBarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
  onRefresh?: () => void; // optional prop to handle refresh
}

export function ClientsControlsBar({
  statusFilter,
  onStatusFilterChange,
  viewMode,
  setViewMode,
  onRefresh,
}: ClientsControlsBarProps) {
  // Simplified bar: dark background, flex row, no heavy border/background
  return (
    <div className="flex flex-row items-center justify-between gap-2 mb-4 px-0 py-0">
      {/* Left: Status filter */}
      <div className="flex flex-row items-center gap-3">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="bg-[#222] border border-border/40 text-white min-w-[140px] h-9 focus:ring-siso-orange/70 focus:outline-none focus:ring-2">
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
      {/* Right: Table/cards button group + refresh */}
      <div className="flex flex-row items-center gap-1">
        <ViewModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="ml-1 px-2 dark:hover:bg-[#333] hover:bg-[#f5f5f5]"
          onClick={() => onRefresh && onRefresh()}
          title="Refresh"
        >
          <RefreshCcw className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
