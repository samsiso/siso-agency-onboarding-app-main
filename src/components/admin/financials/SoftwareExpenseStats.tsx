
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialTransaction } from "@/utils/financial";
import { getExpensesByCategory, SOFTWARE_CATEGORIES } from "@/utils/financial/expenseCategories"; 
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface SoftwareExpenseStatsProps {
  expenses: FinancialTransaction[];
}

export function SoftwareExpenseStats({ expenses }: SoftwareExpenseStatsProps) {
  const categorizedExpenses = getExpensesByCategory(expenses);
  
  // Filter only software categories
  const softwareCategories = Object.values(SOFTWARE_CATEGORIES);
  const softwareExpenses = Object.entries(categorizedExpenses)
    .filter(([category]) => softwareCategories.includes(category))
    .map(([category, data]) => ({
      name: category,
      value: data.total,
      count: data.count
    }))
    .sort((a, b) => b.value - a.value);
  
  // Calculate total software expense
  const totalSoftwareExpense = softwareExpenses.reduce((sum, item) => sum + item.value, 0);
  
  // Colors for the pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
    '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Software Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Software Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(totalSoftwareExpense, "GBP")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Categories</p>
            <p className="text-lg">{softwareExpenses.length}</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={softwareExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {softwareExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value as number, "GBP")} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2 mt-4">
          {softwareExpenses.map((category, index) => (
            <div key={category.name} className="flex justify-between items-center">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm">{category.name}</span>
              </div>
              <div className="text-sm font-medium">
                {formatCurrency(category.value, "GBP")}
                <span className="text-xs text-muted-foreground ml-1">({category.count})</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
