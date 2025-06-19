
import React from "react";
import { DollarSign, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
  totalClients: number;
  totalProjectValue: number;
}

export function DashboardStats({ totalClients, totalProjectValue }: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Clients",
      value: totalClients,
      icon: Users,
      color: "bg-gradient-to-tr from-blue-500/60 to-blue-800/80 text-white",
    },
    {
      label: "Total Project Value",
      value: totalProjectValue.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      icon: DollarSign,
      color: "bg-gradient-to-tr from-orange-400/70 to-orange-700/80 text-white",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={cn(
          "flex-1 min-w-[180px] p-0 border-none shadow-md transition hover:scale-105 duration-200",
          stat.color
        )}>
          <CardContent className="flex items-center gap-4 py-5">
            <div className="rounded-full bg-white/20 p-2">
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-xl">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
