import React from "react";
import { Users, PoundSterling } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  totalClients: number;
  totalProjectValue: number;
}

export function DashboardStats({ totalClients, totalProjectValue }: DashboardStatsProps) {
  // Debug log to see what values we're getting
  console.log('DashboardStats received:', { totalClients, totalProjectValue });

  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Project Value",
      value: totalProjectValue > 0 
        ? totalProjectValue.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
        : "£0.00",
      icon: PoundSterling,
      iconColor: "text-green-600", 
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                stat.bgColor
              )}>
                <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
