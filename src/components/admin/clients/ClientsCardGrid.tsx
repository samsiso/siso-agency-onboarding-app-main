
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ClientData } from "@/types/client.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone, DollarSign, Calendar, ArrowRight, Clock, Circle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClientsList } from "@/hooks/client";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { EnhancedStatusBadge } from "./EnhancedStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ViewClientCard } from './ViewClientCard';

interface ClientsCardGridProps {
  searchQuery: string;
  statusFilter: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onRefetch?: () => void;
  viewMode?: "table" | "cards";
  setViewMode?: (mode: "table" | "cards") => void;
}

export function ClientsCardGrid({
  searchQuery,
  statusFilter,
  sortColumn = "updated_at",
  sortDirection = "desc",
  onRefetch,
  viewMode,
  setViewMode
}: ClientsCardGridProps) {
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

  const getProgressColor = (percentage: number) => {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getFinancialProgressColor = (percentage: number) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
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
        {clients.map((client) => {
          const progressPercentage = client.total_steps 
            ? Math.round((client.current_step / client.total_steps) * 100) 
            : 0;
          
          const financialPercentage = (client.estimated_price && client.estimated_price > 0) 
            ? Math.min(Math.round(((client.estimated_price * 0.6) / client.estimated_price) * 100), 100) 
            : 0;
          
          const incompleteTodos = client.todos?.filter(todo => !todo.completed).slice(0, 2) || [];
          const totalRemainingTodos = (client.todos?.filter(todo => !todo.completed).length || 0) - incompleteTodos.length;

          return (
            <Card
              key={client.id}
              className={cn(
                "flex flex-col hover:shadow-lg hover:scale-[1.02] transition-all duration-200",
                "bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm",
                client.priority === 'high' && 'border-red-500/30',
                client.priority === 'medium' && 'border-amber-500/30',
                client.priority === 'low' && 'border-green-500/30'
              )}
            >
              <CardHeader 
                className="flex flex-row items-center gap-3 pt-6 cursor-pointer relative"
                onClick={() => navigate(`/admin/clients/${client.id}`)}
              >
                <div className="absolute top-2 right-2">
                  <PriorityBadge priority={client.priority} />
                </div>
                
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
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Project Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Project Progress
                    </span>
                    <span className="font-medium">
                      Step {client.current_step} of {client.total_steps}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={progressPercentage} 
                      className="h-2" 
                      indicatorClassName={getProgressColor(progressPercentage)}
                    />
                    <span className="text-xs font-medium min-w-[2rem] text-right">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* Financial Information */}
                {client.estimated_price && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" />
                        Project Value
                      </span>
                      <Badge variant="outline" className="font-normal">
                        {formatCurrency(client.estimated_price)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={financialPercentage} 
                        className="h-2" 
                        indicatorClassName={getFinancialProgressColor(financialPercentage)}
                      />
                      <span className="text-xs font-medium min-w-[2rem] text-right">
                        {financialPercentage}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Next Steps & Todos */}
                <Collapsible className="border rounded-md p-2">
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> 
                      Next Steps
                    </span>
                    <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2">
                    {client.next_steps ? (
                      <p className="text-xs text-muted-foreground mb-2">{client.next_steps}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground italic mb-2">No next steps specified</p>
                    )}

                    {incompleteTodos.length > 0 && (
                      <div className="space-y-1.5 mt-2">
                        <div className="text-xs font-medium">Pending Tasks:</div>
                        {incompleteTodos.map((todo, index) => (
                          <div key={index} className="flex items-start gap-1.5">
                            <Circle className="h-3 w-3 text-muted-foreground mt-0.5" />
                            <span className="text-xs">{todo.text}</span>
                          </div>
                        ))}
                        {totalRemainingTodos > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            +{totalRemainingTodos} more tasks
                          </div>
                        )}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>

                {/* Contact Info */}
                {(client.email || client.phone) && (
                  <div className="space-y-1.5">
                    {client.email && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Mail className="h-3.5 w-3.5" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Timeline */}
                {(client.start_date || client.estimated_completion_date) && (
                  <div className="grid grid-cols-2 gap-2 text-sm border-t pt-2">
                    {client.start_date && (
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Started
                        </div>
                        <div>{formatDate(client.start_date, 'short')}</div>
                      </div>
                    )}
                    {client.estimated_completion_date && (
                      <div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Due
                        </div>
                        <div>{formatDate(client.estimated_completion_date, 'short')}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-0 pb-4 px-6 mt-2">
                <ViewClientCard clientId={client.id} />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

// Temporary implementation of ChevronDownIcon since we can't import from lucide-react
function ChevronDownIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}
