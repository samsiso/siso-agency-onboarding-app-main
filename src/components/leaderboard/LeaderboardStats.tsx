import { Trophy, Users, Activity } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface LeaderboardStatsProps {
  totalUsers: number;
  totalPoints: number;
  activeUsers: number;
}

export const LeaderboardStats = ({ totalUsers, totalPoints, activeUsers }: LeaderboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-siso-bg-alt">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total Users</p>
              <p className="text-2xl font-bold text-siso-text-bold">{totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-siso-bg-alt">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Total Points</p>
              <p className="text-2xl font-bold text-siso-text-bold">{totalPoints.toLocaleString()}</p>
            </div>
            <Trophy className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-siso-bg-alt">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-siso-text/70">Active Users</p>
              <p className="text-2xl font-bold text-siso-text-bold">{activeUsers}</p>
            </div>
            <Activity className="h-8 w-8 text-siso-orange opacity-80" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};