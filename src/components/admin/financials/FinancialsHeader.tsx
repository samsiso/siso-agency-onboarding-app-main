
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, Calendar } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerWithRange } from "@/components/admin/financials/DatePickerWithRange";
import { useState } from "react";

export function FinancialsHeader() {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
        <p className="mt-1 text-muted-foreground">
          Track expenses, revenue, and monitor your agency's financial health
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <DatePickerWithRange date={date} setDate={setDate} />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </Button>
        
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </div>
    </div>
  );
}
