
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FinancialTransaction } from "@/utils/financial";
import { formatCurrency } from "@/lib/formatters";
import { Clock, Check, AlertCircle, Calendar, ArrowRight, PlusCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateExpenseDialog } from "./expense/CreateExpenseDialog";

interface FinancialPipelineProps {
  expenses: FinancialTransaction[];
  revenues: FinancialTransaction[];
  isLoading: boolean;
  onDataChange: () => Promise<void>;
}

export function FinancialPipeline({ expenses, revenues, isLoading, onDataChange }: FinancialPipelineProps) {
  const [pipelineView, setPipelineView] = useState<"kanban" | "list">("kanban");
  
  // Group expenses by status
  const expensesByStatus = useMemo(() => {
    const pending = [];
    const upcoming = [];
    const completed = [];
    
    expenses.forEach(expense => {
      const today = new Date();
      const expenseDate = new Date(expense.date);
      
      if (expense.status === "completed") {
        completed.push(expense);
      } else if (expenseDate < today) {
        pending.push(expense);
      } else {
        upcoming.push(expense);
      }
    });
    
    return { pending, upcoming, completed };
  }, [expenses]);
  
  // Calculate totals
  const pendingTotal = expensesByStatus.pending.reduce((sum, expense) => sum + expense.amount, 0);
  const upcomingTotal = expensesByStatus.upcoming.reduce((sum, expense) => sum + expense.amount, 0);
  const completedTotal = expensesByStatus.completed.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate days until next expense
  const daysUntilNextExpense = () => {
    if (expensesByStatus.upcoming.length === 0) return null;
    
    const today = new Date();
    let closestDate = Infinity;
    
    expensesByStatus.upcoming.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const diffTime = expenseDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && diffDays < closestDate) {
        closestDate = diffDays;
      }
    });
    
    return closestDate === Infinity ? null : closestDate;
  };
  
  const nextExpenseDays = daysUntilNextExpense();

  const renderExpenseCard = (expense: FinancialTransaction) => {
    return (
      <Card key={expense.id} className="mb-3 bg-background/50 hover:bg-background/80 transition-colors">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{expense.description}</h3>
            <div className="text-right">
              <div className="font-bold">{formatCurrency(expense.amount, "GBP")}</div>
              <div className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            {expense.category && (
              <div className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-300 text-xs">
                {expense.category.name || "Uncategorized"}
              </div>
            )}
            
            {expense.recurring_type && expense.recurring_type !== "one-time" && (
              <div className="text-xs text-amber-300 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {expense.recurring_type}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Financial Pipeline</h2>
          <p className="text-muted-foreground">Track and manage your financial expenses</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="kanban" onValueChange={(v) => setPipelineView(v as any)}>
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <CreateExpenseDialog onDataChange={onDataChange} />
        </div>
      </div>
      
      {/* Progress indicator */}
      <Card className="bg-card/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-900/30 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-bold">{formatCurrency(pendingTotal, "GBP")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-lg font-bold">{formatCurrency(upcomingTotal, "GBP")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-900/30 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-lg font-bold">{formatCurrency(completedTotal, "GBP")}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm">Financial health</p>
              <p className="text-sm font-medium">{Math.round((completedTotal / (pendingTotal + upcomingTotal + completedTotal)) * 100) || 0}%</p>
            </div>
            <Progress value={(completedTotal / (pendingTotal + upcomingTotal + completedTotal)) * 100 || 0} className="h-2" />
          </div>
          
          {nextExpenseDays !== null && (
            <div className="mt-4 py-2 px-4 rounded-md bg-amber-900/20 border border-amber-500/30 flex items-center">
              <Clock className="h-4 w-4 text-amber-400 mr-2" />
              <span className="text-amber-200">Next expense due in {nextExpenseDays} day{nextExpenseDays === 1 ? '' : 's'}</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {pipelineView === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <Card className="bg-card/20">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="flex items-center text-amber-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                Pending ({expensesByStatus.pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-auto max-h-[calc(100vh-400px)]">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
              ) : expensesByStatus.pending.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No pending expenses</div>
              ) : (
                expensesByStatus.pending.map(renderExpenseCard)
              )}
              
              <Button variant="ghost" className="w-full mt-2 border border-dashed border-border/50 flex items-center justify-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
          
          {/* Upcoming Column */}
          <Card className="bg-card/20">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="flex items-center text-blue-300">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming ({expensesByStatus.upcoming.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-auto max-h-[calc(100vh-400px)]">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
              ) : expensesByStatus.upcoming.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No upcoming expenses</div>
              ) : (
                expensesByStatus.upcoming.map(renderExpenseCard)
              )}
              
              <Button variant="ghost" className="w-full mt-2 border border-dashed border-border/50 flex items-center justify-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>
          
          {/* Completed Column */}
          <Card className="bg-card/20">
            <CardHeader className="pb-2 border-b border-border/10">
              <CardTitle className="flex items-center text-green-300">
                <Check className="h-4 w-4 mr-2" />
                Completed ({expensesByStatus.completed.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-auto max-h-[calc(100vh-400px)]">
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading...</div>
              ) : expensesByStatus.completed.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No completed expenses</div>
              ) : (
                expensesByStatus.completed.slice(0, 10).map(renderExpenseCard)
              )}
              
              {expensesByStatus.completed.length > 10 && (
                <Button variant="ghost" className="w-full mt-2">
                  View {expensesByStatus.completed.length - 10} more
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Financial Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Upcoming expenses timeline */}
              <div className="relative">
                {expensesByStatus.upcoming.slice(0, 5).map((expense, index) => (
                  <div key={expense.id} className="relative pl-6 pb-6">
                    <div className="absolute left-0 top-0 h-full">
                      <div className="h-full w-px bg-muted-foreground/30"></div>
                    </div>
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary"></div>
                    
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{expense.description}</h4>
                        <div className="text-sm text-muted-foreground">
                          Due {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(expense.amount, "GBP")}</div>
                        {expense.category && (
                          <div className="text-xs text-primary">{expense.category.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View all button */}
              <Button variant="outline" className="w-full">
                View All Expenses
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Linked Task Section */}
      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Linked Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Connect your expenses to tasks for better tracking
            </p>
            <Button className="mt-4">
              View Task Manager
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Client Base Integration */}
      <Card className="bg-card/20">
        <CardHeader>
          <CardTitle>Client Financials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Link your expenses to clients to track project profitability
            </p>
            <Button className="mt-4">
              View Client Base
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
