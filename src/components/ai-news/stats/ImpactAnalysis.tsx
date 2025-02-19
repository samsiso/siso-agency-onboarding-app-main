
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Radar } from 'lucide-react';

interface ImpactAnalysisProps {
  stats: NonNullable<ReturnType<typeof import('./calculateStats').calculateStats>>;
}

export const ImpactAnalysis = ({ stats }: ImpactAnalysisProps) => {
  return (
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
            <span className="text-2xl font-bold">
              {((stats.impactDistribution.high / stats.totalDevelopments) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="bg-yellow-500/10 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Medium</span>
            </div>
            <span className="text-2xl font-bold">
              {((stats.impactDistribution.medium / stats.totalDevelopments) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="bg-blue-500/10 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Low</span>
            </div>
            <span className="text-2xl font-bold">
              {((stats.impactDistribution.low / stats.totalDevelopments) * 100).toFixed(0)}%
            </span>
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
  );
};
