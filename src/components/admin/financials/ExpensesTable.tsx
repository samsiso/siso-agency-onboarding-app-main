
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  ArrowUpDown,
  FileDown,
  FilePlus,
  Edit,
  Trash,
  Eye,
  Loader2
} from "lucide-react";
import { FinancialTransaction, deleteTransaction } from "@/utils/financialHelpers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpensesTableProps {
  expenses: FinancialTransaction[];
  isLoading?: boolean;
  onDataChange?: () => void;
}

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }: ExpensesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Get the expense being viewed in the details dialog
  const expenseDetails = viewDetailsId 
    ? expenses.find(expense => expense.id === viewDetailsId) 
    : null;

  // Handle sort toggling
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Simple client-side filtering and sorting
  const filteredExpenses = expenses
    .filter(expense => 
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${expense.amount}`.includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      } else if (sortField === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime() 
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === "name") {
        const aVal = a.description || "";
        const bVal = b.description || "";
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      } else if (sortField === "category") {
        const aVal = a.category?.name || "";
        const bVal = b.category?.name || "";
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

  // Handle expense deletion
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const success = await deleteTransaction(id);
      if (success && onDataChange) {
        onDataChange();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Expenses Tracking</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="h-9">
            <FilePlus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                  Expense Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("amount")}>
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Recurrence</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length > 0 ? (
              filteredExpenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell>£{expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.recurring_type === 'monthly' 
                        ? 'bg-green-100 text-green-800' 
                        : expense.recurring_type === 'annual'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {expense.recurring_type === 'monthly' 
                        ? 'Monthly' 
                        : expense.recurring_type === 'annual'
                        ? 'Annual'
                        : 'One-Time'}
                    </span>
                  </TableCell>
                  <TableCell>{expense.vendor?.name || "—"}</TableCell>
                  <TableCell>{expense.payment_method?.name || "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewDetailsId(expense.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No expenses found. Try adjusting your filters or add a new expense.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Expense Details Dialog */}
      {expenseDetails && (
        <Dialog open={!!viewDetailsId} onOpenChange={(open) => !open && setViewDetailsId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Expense Details</DialogTitle>
              <DialogDescription>
                View detailed information about this expense.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p>{expenseDetails.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                  <p className="font-semibold">£{expenseDetails.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <p>{new Date(expenseDetails.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p>{expenseDetails.category?.name || "Uncategorized"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Vendor</h3>
                  <p>{expenseDetails.vendor?.name || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Method</h3>
                  <p>{expenseDetails.payment_method?.name || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Recurrence</h3>
                  <p>
                    {expenseDetails.recurring_type === 'monthly' 
                      ? 'Monthly' 
                      : expenseDetails.recurring_type === 'annual'
                      ? 'Annual'
                      : 'One-Time'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{expenseDetails.status}</p>
                </div>
              </div>
              {expenseDetails.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                  <p className="text-sm">{expenseDetails.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
