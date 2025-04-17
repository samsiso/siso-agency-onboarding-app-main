
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter, Calendar, FileUp, ChevronDown } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerWithRange } from "@/components/admin/financials/DatePickerWithRange";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { addTransaction } from "@/utils/financialHelpers";

export function FinancialsHeader({ onFilterChange }) {
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddRevenueOpen, setIsAddRevenueOpen] = useState(false);

  // When date range changes, notify parent component
  const handleDateChange = (newDate: { from: Date | undefined; to: Date | undefined }) => {
    setDate(newDate);
    if (onFilterChange) {
      onFilterChange({ dateRange: newDate });
    }
  };

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
              <span>
                {date.from ? (
                  date.to ? (
                    <>
                      {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
                    </>
                  ) : (
                    date.from.toLocaleDateString()
                  )
                ) : (
                  "Date Range"
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <DatePickerWithRange date={date} setDate={handleDateChange} />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add New</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setIsAddExpenseOpen(true)}>
              Add Expense
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setIsAddRevenueOpen(true)}>
              Add Revenue
            </DropdownMenuItem>
            <DropdownMenuItem>
              Create Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add Expense Dialog - In a real app, this would be a separate component */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Record a new expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This is a placeholder for the expense form. In a real application, this would be
              a complete form with fields for amount, date, category, vendor, etc.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Revenue Dialog - In a real app, this would be a separate component */}
      <Dialog open={isAddRevenueOpen} onOpenChange={setIsAddRevenueOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Revenue</DialogTitle>
            <DialogDescription>
              Record a new revenue transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This is a placeholder for the revenue form. In a real application, this would be
              a complete form with fields for amount, date, source, client, etc.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
