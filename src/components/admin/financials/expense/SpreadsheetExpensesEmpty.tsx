
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function SpreadsheetExpensesEmpty() {
  return (
    <tr>
      <td colSpan={1000} className="py-10">
        <div className="flex flex-col items-center justify-center gap-2 select-none">
          <Badge
            variant="info"
            className="mb-2 px-4 py-2 flex items-center gap-1 text-base border-info bg-blue-600/10 text-blue-400 border-blue-500 shadow-md"
          >
            <Info className="mr-1 h-5 w-5 text-blue-400" />
            No expenses found
          </Badge>
          <div className="text-base text-muted-foreground/90 text-center font-medium">
            Try adjusting your filters <span className="text-info">or add a new expense</span>.
          </div>
        </div>
      </td>
    </tr>
  );
}
