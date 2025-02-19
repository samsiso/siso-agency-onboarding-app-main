
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Shield, 
  Radar,
  Bot,
  Database,
  Scale
} from 'lucide-react';

interface DailyStatsOverviewProps {
  newsItems: any[];
}

// [Analysis] Calculate statistics from news items
const calculateStats = (items: any[]) => {
  const total = items.length;
  if (total === 0) return null;

  const impactDistribution = {
    high: items.filter(item => item.impact === 'high').length,
    medium: items.filter(item => item.impact === 'medium').length,
    low: items.filter(item => item.impact === 'low').length,
  };

  const categoryDistribution = items.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalDevelopments: total,
    impactDistribution,
    categoryDistribution,
    averageComplexity: items.reduce((sum, item) => {
      const complexityScore = item.technical_complexity === 'advanced' ? 3 
        : item.technical_complexity === 'intermediate' ? 2 : 1;
      return sum + complexityScore;
    }, 0) / total
  };
};

const DailyStatsOverview = ({ newsItems }: DailyStatsOverviewProps) => {
  const stats = calculateStats(newsItems);
  if (!stats) return null;

  // Simulate trend data
  const trendData = [
    { name: '6AM', value: 30 },
    { name: '9AM', value: 45 },
    { name: '12PM', value: 75 },
    { name: '3PM', value: 85 },
    { name: '6PM', value: 100 },
  ];

  const techBreakdown = [
    { area: 'AI/ML', percentage: 45 },
    { area: 'Robotics', percentage: 25 },
    { area: 'Research Tools', percentage: 20 },
    { area: 'Policy & Ethics', percentage: 10 },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Top Stats Row */}
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

      {/* Technology Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technology Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {techBreakdown.map(tech => (
              <div key={tech.area} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {tech.area === 'AI/ML' && <Brain className="h-4 w-4 text-blue-500" />}
                    {tech.area === 'Robotics' && <Bot className="h-4 w-4 text-green-500" />}
                    {tech.area === 'Research Tools' && <Database className="h-4 w-4 text-yellow-500" />}
                    {tech.area === 'Policy & Ethics' && <Scale className="h-4 w-4 text-purple-500" />}
                    <span>{tech.area}</span>
                  </div>
                  <span className="font-medium">{tech.percentage}%</span>
                </div>
                <Progress 
                  value={tech.percentage} 
                  className="h-2"
                  indicatorClassName={
                    tech.area === 'AI/ML' ? 'bg-blue-500' :
                    tech.area === 'Robotics' ? 'bg-green-500' :
                    tech.area === 'Research Tools' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Radar className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">High Impact</span>
                </div>
                <span className="text-2xl font-bold">{((stats.impactDistribution.high / stats.totalDevelopments) * 100).toFixed(0)}%</span>
              </div>
              <div className="bg-yellow-500/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Radar className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Medium</span>
                </div>
                <span className="text-2xl font-bold">{((stats.impactDistribution.medium / stats.totalDevelopments) * 100).toFixed(0)}%</span>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Radar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Low</span>
                </div>
                <span className="text-2xl font-bold">{((stats.impactDistribution.low / stats.totalDevelopments) * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Daily Impact</span>
                  <span className="font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Innovation Score</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Market Potential</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyStatsOverview;
