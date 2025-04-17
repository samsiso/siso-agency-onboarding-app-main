
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, PieChart } from "@/components/admin/financials/Charts";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  Receipt, 
  CreditCard
} from "lucide-react";
import { getFinancialSummary } from "@/utils/financialHelpers";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FinancialsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0, 
    profitMargin: 0,
    outstandingAmount: 0,
    revenueByMonth: []
  });

  useEffect(() => {
    async function loadSummary() {
      setIsLoading(true);
      const data = await getFinancialSummary(period);
      setSummary(data);
      setIsLoading(false);
    }
    
    loadSummary();
  }, [period]);

  return (
    <div className="grid gap-6">
      {/* Period selector */}
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Revenue" 
          value={`£${summary.totalRevenue.toLocaleString()}`}
          trend="+12%" 
          trendType="up"
          description="vs last month"
          icon={<DollarSign className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <SummaryCard 
          title="Total Expenses" 
          value={`£${summary.totalExpenses.toLocaleString()}`}
          trend="+5%" 
          trendType="up"
          description="vs last month"
          icon={<CreditCard className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <SummaryCard 
          title="Profit Margin" 
          value={`${summary.profitMargin.toFixed(1)}%`}
          trend="+3%" 
          trendType="up"
          description="vs last month"
          icon={<TrendingUp className="h-4 w-4" />}
          isLoading={isLoading}
        />
        <SummaryCard 
          title="Outstanding" 
          value={`£${summary.outstandingAmount.toLocaleString()}`}
          trend="-15%" 
          trendType="down"
          description="vs last month"
          icon={<Receipt className="h-4 w-4" />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={summary.revenueByMonth} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart />
        </CardContent>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  description: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

function SummaryCard({ title, value, trend, trendType, description, icon, isLoading = false }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <div className="flex items-center mt-1">
          <span className={`flex items-center text-xs ${
            trendType === 'up' ? 'text-green-500' : 'text-red-500'
          }`}>
            {trendType === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {trend}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
