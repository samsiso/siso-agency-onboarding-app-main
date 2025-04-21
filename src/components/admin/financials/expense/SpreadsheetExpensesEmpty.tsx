
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

export function SpreadsheetExpensesEmpty() {
  return (
    <tr>
      <td colSpan={1000} className="py-12">
        <div className="flex flex-col items-center justify-center gap-3 select-none">
          <div className="rounded-xl border-2 border-blue-400/60 bg-blue-900/20 px-8 py-5 shadow-xl flex items-center gap-2 animate-fade-in">
            <Info className="mr-2 h-6 w-6 text-blue-300" />
            <span className="text-blue-100 font-semibold text-lg tracking-wide">
              No expenses found
            </span>
          </div>
          <div className="text-base text-blue-200 mt-1 text-center max-w-xs">
            Try adjusting your filters or <span className="text-blue-300 font-bold">add a new expense</span>.
          </div>
        </div>
      </td>
    </tr>
  );
}
