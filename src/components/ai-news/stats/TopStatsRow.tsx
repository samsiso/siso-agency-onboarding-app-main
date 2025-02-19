
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap, Brain, TrendingUp, Shield } from 'lucide-react';

interface TopStatsRowProps {
  stats: ReturnType<typeof import('./calculateStats').calculateStats>;
}

export const TopStatsRow = ({ stats }: TopStatsRowProps) => {
  if (!stats) return null;

  const trendData = [
    { name: '6AM', value: 30 },
    { name: '9AM', value: 45 },
    { name: '12PM', value: 75 },
    { name: '3PM', value: 85 },
    { name: '6PM', value: 100 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI Developments Today</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDevelopments}</div>
          <p className="text-xs text-muted-foreground">
            +12% from yesterday
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Impact Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <ResponsiveContainer height={40}>
            <LineChart data={trendData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Technical Complexity</CardTitle>
          <Brain className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageComplexity.toFixed(1)}/3.0
          </div>
          <Progress 
            value={stats.averageComplexity * 33.33} 
            className="h-2 mt-2" 
            indicatorClassName="bg-blue-500"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Source Credibility</CardTitle>
          <Shield className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-xs text-muted-foreground">
            Verified sources
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
