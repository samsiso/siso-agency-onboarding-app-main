
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "./PriorityBadge";
import { ClientData } from "@/types/client.types";
import { useClientsList } from "@/hooks/client";
import { cn } from "@/lib/utils";

interface PriorityListingProps {
  limit?: number;
}

export function PriorityListing({ limit = 3 }: PriorityListingProps) {
  const { clients = [], isLoading } = useClientsList({
    statusFilter: "",
    sortColumn: "priority",
    sortDirection: "desc",
    pageSize: 100,
  });

  // Show only clients with priority, sorted 'high' first
  const highPriority = (clients ?? [])
    .filter(c => c.priority === "high" || c.priority === "medium" || c.priority === "low")
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority ?? "low"] ?? 3) - (order[b.priority ?? "low"] ?? 3);
    })
    .slice(0, limit);

  if (isLoading) {
    return (
      <Card className="bg-white/10 border-none">
        <CardHeader>
          <CardTitle>Top Priority Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (highPriority.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-red-400/10 to-red-800/30 shadow-md border-none">
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <Users className="h-5 w-5 text-red-600" />
          Top Priority Clients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {highPriority.map(client => (
            <li key={client.id} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                {client.avatar_url
                  ? <img src={client.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                  : <Users className="h-5 w-5 text-muted-foreground/50" />}
              </div>
              <div className="flex-1">
                <span className="font-medium">{client.full_name}</span>
                {client.business_name && (
                  <span className="ml-2 text-xs text-muted-foreground/70">({client.business_name})</span>
                )}
              </div>
              <PriorityBadge priority={client.priority} className="" />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
