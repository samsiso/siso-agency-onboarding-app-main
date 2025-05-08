import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/utils/financial/expenses';
import { Receipt, Clock, CheckCircle, AlertTriangle, RefreshCcw } from 'lucide-react';

interface ExpensesListProps {
  expenses: Expense[];
  formatDate: (date: string) => string;
}

export function ExpensesList({ expenses, formatDate }: ExpensesListProps) {
  // Get status badge based on expense status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/50">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-500/50">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border-gray-500/50">{status}</Badge>;
    }
  };

  // Get frequency display with icon
  const getFrequencyDisplay = (frequency?: string) => {
    if (!frequency || frequency === 'one-time') {
      return (
        <div className="flex items-center text-white/70 text-xs">
          <Receipt className="h-3 w-3 mr-1" />
          One-time
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-white/70 text-xs">
        <RefreshCcw className="h-3 w-3 mr-1" />
        {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
      </div>
    );
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'Infrastructure': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      'Security': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      'Development': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      'Marketing': 'bg-green-500/20 text-green-300 border-green-500/40',
      'Support': 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      'Consulting': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      'Other': 'bg-gray-500/20 text-gray-300 border-gray-500/40'
    };
    
    return categories[category] || categories['Other'];
  };

  return (
    <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <Receipt className="h-5 w-5 text-orange-500" />
          All Project Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-white/70">No expenses found for this project.</p>
          </div>
        ) : (
          <div className="rounded-md border border-purple-500/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-purple-950/30">
                <TableRow className="hover:bg-purple-950/40 border-purple-500/20">
                  <TableHead className="text-white/90 w-[200px]">Expense</TableHead>
                  <TableHead className="text-white/90">Description</TableHead>
                  <TableHead className="text-white/90">Category</TableHead>
                  <TableHead className="text-white/90">Status</TableHead>
                  <TableHead className="text-white/90">Date</TableHead>
                  <TableHead className="text-white/90 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-purple-950/10 border-t border-purple-500/20">
                    <TableCell className="font-medium text-white">{expense.name}</TableCell>
                    <TableCell className="text-white/70">{expense.description}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getCategoryColor(expense.category)}`}
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-white/70 text-xs flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {formatDate(expense.start_date)}
                        </span>
                        {expense.next_billing_date && (
                          <span className="text-white/70 text-xs flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            Next: {formatDate(expense.next_billing_date)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-white">
                          {expense.currency}{expense.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-white/60">
                          {getFrequencyDisplay(expense.frequency)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
