
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign, BarChart, UserPlus } from "lucide-react";

interface ClientAnalyticsCardsProps {
  activeClients: number;
  pipelineClients: number;
  pipelineValue: number;
  conversionRate: number;
}

export function ClientAnalyticsCards({
  activeClients,
  pipelineClients,
  pipelineValue,
  conversionRate
}: ClientAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30 card-hover">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
            <h3 className="text-2xl font-bold mt-1">{activeClients}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30 card-hover">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pipeline Clients</p>
            <h3 className="text-2xl font-bold mt-1">{pipelineClients}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30 card-hover">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pipeline Value</p>
            <h3 className="text-2xl font-bold mt-1">${pipelineValue.toLocaleString()}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30 card-hover">
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
            <h3 className="text-2xl font-bold mt-1">{conversionRate}%</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <BarChart className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
