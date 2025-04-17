
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

export function FinancialsDashboard() {
  return (
    <div className="grid gap-6">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Revenue" 
          value="£50,000" 
          trend="+12%" 
          trendType="up"
          description="vs last month"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <SummaryCard 
          title="Total Expenses" 
          value="£20,000" 
          trend="+5%" 
          trendType="up"
          description="vs last month"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <SummaryCard 
          title="Profit Margin" 
          value="60%" 
          trend="+3%" 
          trendType="up"
          description="vs last month"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <SummaryCard 
          title="Outstanding" 
          value="£3,500" 
          trend="-15%" 
          trendType="down"
          description="vs last month"
          icon={<Receipt className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart />
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
}

function SummaryCard({ title, value, trend, trendType, description, icon }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
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
