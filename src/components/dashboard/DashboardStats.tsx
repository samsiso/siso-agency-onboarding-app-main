
import { Card } from "@/components/ui/card";
import { ArrowUpRight, Users, CreditCard, ChartLineUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, isPositive, icon }: StatCardProps) {
  return (
    <Card className="bg-black/30 border border-siso-text/10 p-5 hover:border-siso-orange/30 transition-all duration-300">
      <div className="flex justify-between">
        <div>
          <p className="text-siso-text text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20">
          {icon}
        </div>
      </div>
      <div className="flex items-center mt-3">
        <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {isPositive ? '↑' : '↓'} {change}
        </span>
        <span className="text-xs text-siso-text ml-2">vs last month</span>
      </div>
    </Card>
  );
}

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <StatCard 
        title="Active Clients" 
        value="24" 
        change="12%" 
        isPositive={true}
        icon={<Users className="h-5 w-5 text-siso-orange" />}
      />
      <StatCard 
        title="Revenue" 
        value="$12,450" 
        change="8%" 
        isPositive={true}
        icon={<CreditCard className="h-5 w-5 text-siso-orange" />}
      />
      <StatCard 
        title="Conversion Rate" 
        value="64%" 
        change="5%" 
        isPositive={false}
        icon={<ChartLineUp className="h-5 w-5 text-siso-orange" />}
      />
    </div>
  );
}
