
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClientData } from "@/types/client.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, DollarSign, Flag, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClientsList } from "@/hooks/client";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { EnhancedStatusBadge } from "./EnhancedStatusBadge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface ClientsCardGridProps {
  searchQuery: string;
  statusFilter: string;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onRefetch?: () => void;
}

export const ClientsCardGrid = ({
  searchQuery,
  statusFilter,
  sortColumn,
  sortDirection,
  onRefetch
}: ClientsCardGridProps) => {
  const navigate = useNavigate();
  
  const {
    clients,
    isLoading,
    refetch
  } = useClientsList({
    searchQuery,
    statusFilter,
    sortColumn,
    sortDirection,
    pageSize: 100,
  });

  const handleRefetch = () => {
    if (onRefetch) {
      onRefetch();
    } else {
      refetch();
    }
  };

  const getPriorityColor = (priority: string | null | undefined) => {
    if (!priority) return 'text-muted-foreground';
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Skeleton className="h-8 w-8 rounded-full mb-2" />
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p>No clients found.</p>
        <Button variant="outline" className="mt-4" onClick={handleRefetch}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer bg-card/50 backdrop-blur-sm"
            onClick={() => navigate(`/admin/clients/${client.id}`)}
          >
            <CardHeader className="flex flex-row items-center gap-3 pt-6">
              {client.avatar_url ? (
                <img
                  src={client.avatar_url}
                  alt={client.full_name || "Client"}
                  className="h-12 w-12 rounded-full object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center">
                  <Users className="h-7 w-7 text-muted-foreground/70" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-base font-semibold leading-tight">
                  {client.full_name || "Unknown"}
                </CardTitle>
                {client.business_name && (
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {client.business_name}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <EnhancedStatusBadge status={client.status} />
                  {client.priority && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className={cn("gap-1 border-none", getPriorityColor(client.priority as string | null))}>
                          <Flag className="h-3 w-3" />
                          <span>{client.priority}</span>
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>Priority Level</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="grid gap-3 text-sm">
                {/* Contact Info */}
                {(client.email || client.phone) && (
                  <div className="space-y-1.5">
                    {client.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Project Details */}
                {(client.project_name || client.company_niche) && (
                  <>
                    <Separator className="my-2 opacity-50" />
                    <div className="space-y-1.5">
                      {client.project_name && (
                        <div className="space-y-0.5">
                          <div className="text-xs text-muted-foreground">Project</div>
                          <div className="font-medium">{client.project_name}</div>
                        </div>
                      )}
                      {client.company_niche && (
                        <div className="space-y-0.5">
                          <div className="text-xs text-muted-foreground">Industry</div>
                          <div>{client.company_niche}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Financial Info */}
                {(client.estimated_price || client.payment_status) && (
                  <>
                    <Separator className="my-2 opacity-50" />
                    <div className="space-y-1.5">
                      {client.estimated_price && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>Budget</span>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(client.estimated_price)}
                          </span>
                        </div>
                      )}
                      {client.payment_status && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Payment Status</span>
                          <Badge variant="outline" className="font-normal">
                            {client.payment_status}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Timeline */}
                {(client.start_date || client.estimated_completion_date) && (
                  <>
                    <Separator className="my-2 opacity-50" />
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {client.start_date && (
                        <div>
                          <div className="text-xs text-muted-foreground">Started</div>
                          <div>{formatDate(client.start_date, 'short')}</div>
                        </div>
                      )}
                      {client.estimated_completion_date && (
                        <div>
                          <div className="text-xs text-muted-foreground">Due</div>
                          <div>{formatDate(client.estimated_completion_date, 'short')}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};
