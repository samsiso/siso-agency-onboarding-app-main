
import { Button } from '@/components/ui/button';

interface ViewModeSwitcherProps {
  viewMode: "table" | "cards";
  setViewMode: (mode: "table" | "cards") => void;
}

export function ViewModeSwitcher({ viewMode, setViewMode }: ViewModeSwitcherProps) {
  return (
    <div className="flex justify-end items-center mb-4 gap-2">
      <span className="text-sm text-muted-foreground mr-2">View as:</span>
      <Button
        size="sm"
        variant={viewMode === "table" ? "default" : "outline"}
        className="rounded-full px-3"
        onClick={() => setViewMode("table")}
      >
        Table
      </Button>
      <Button
        size="sm"
        variant={viewMode === "cards" ? "default" : "outline"}
        className="rounded-full px-3"
        onClick={() => setViewMode("cards")}
      >
        Cards
      </Button>
    </div>
  );
}
