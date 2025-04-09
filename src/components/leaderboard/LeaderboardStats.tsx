
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, Users, Coins, Wallet } from "lucide-react";

interface LeaderboardStatsProps {
  totalUsers: number;
  totalPoints: number;
  totalTokens: number;
  trends: {
    users: number;
    points: number;
    tokens: number;
  };
}

export function LeaderboardStats({ totalUsers, totalPoints, totalTokens, trends }: LeaderboardStatsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Total Users" 
        value={formatNumber(totalUsers)}
        description="Active participants"
        icon={<Users className="h-4 w-4" />}
        trend={trends.users}
      />
      
      <StatCard 
        title="Total Points" 
        value={formatNumber(totalPoints)}
        description="Points earned by community"
        icon={<Coins className="h-4 w-4" />}
        trend={trends.points}
      />
      
      <StatCard 
        title="Total SISO Tokens" 
        value={formatNumber(totalTokens)}
        description="Tokens issued to users"
        icon={<Wallet className="h-4 w-4" />}
        trend={trends.tokens}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: number;
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card className="bg-black/30 border border-siso-text/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-siso-text-bold">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-siso-orange">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-siso-text-bold">{value}</div>
        <p className="text-xs text-siso-text/70">{description}</p>
        {trend !== 0 && (
          <div className="flex items-center pt-1">
            {trend > 0 ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}% from last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
