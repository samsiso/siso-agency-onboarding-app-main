
import { Button } from '@/components/ui/button';

interface ViewModeSwitcherProps {
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
}

export function ViewModeSwitcher({ viewMode, setViewMode }: ViewModeSwitcherProps) {
  return (
    <div className="flex items-center h-16 px-6 bg-background rounded-xl shadow-sm border border-border/30 mb-6 gap-2">
      <span className="text-base font-medium text-muted-foreground mr-3">
        View as:
      </span>
      <Button
        size="sm"
        variant={viewMode === "table" ? "default" : "outline"}
        className="rounded-full px-5 h-10 text-base"
        onClick={() => setViewMode("table")}
      >
        Table
      </Button>
      <Button
        size="sm"
        variant={viewMode === "cards" ? "default" : "outline"}
        className="rounded-full px-5 h-10 text-base"
        onClick={() => setViewMode("cards")}
      >
        Cards
      </Button>
    </div>
  );
}

