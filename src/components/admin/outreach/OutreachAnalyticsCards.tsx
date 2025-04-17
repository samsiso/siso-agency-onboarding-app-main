
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  CheckCircle, 
  TrendingUp
} from 'lucide-react';

interface OutreachStatsProps {
  stats: {
    total: number;
    contacted: number;
    converted: number;
    pending: number;
    conversionRate: number;
  };
}

export function OutreachAnalyticsCards({ stats }: OutreachStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-900/10 to-blue-900/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <CardContent className="p-6 flex flex-col relative z-10">
          <div className="text-blue-400 mb-2">
            <User className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-sm">Total Leads</p>
          <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
          {stats.total > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              <span className="text-green-500">+{Math.round(stats.total * 0.1)}</span> from last week
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-900/10 to-amber-900/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <CardContent className="p-6 flex flex-col relative z-10">
          <div className="text-amber-400 mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-sm">Contacted</p>
          <h3 className="text-2xl font-bold mt-1">{stats.contacted}</h3>
          {stats.total > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              {Math.round((stats.contacted / stats.total) * 100)}% of total leads
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-900/10 to-green-900/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <CardContent className="p-6 flex flex-col relative z-10">
          <div className="text-green-400 mb-2">
            <CheckCircle className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-sm">Converted</p>
          <h3 className="text-2xl font-bold mt-1">{stats.converted}</h3>
          {stats.contacted > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              {Math.round((stats.converted / stats.contacted) * 100)}% of contacted leads
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-900/10 to-purple-900/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <CardContent className="p-6 flex flex-col relative z-10">
          <div className="text-purple-400 mb-2">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-muted-foreground text-sm">Conversion Rate</p>
          <h3 className="text-2xl font-bold mt-1">{stats.conversionRate}%</h3>
          {stats.conversionRate > 0 && stats.total > 0 && (
            <div className="text-xs text-muted-foreground mt-2">
              <span className={stats.conversionRate > 20 ? "text-green-500" : "text-amber-500"}>
                {stats.conversionRate > 20 ? "Good" : "Needs improvement"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
