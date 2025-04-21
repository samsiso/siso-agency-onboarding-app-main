
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ClientData, ClientViewPreference } from "@/types/client.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientsCardGridProps {
  clients: ClientData[];
  isLoading: boolean;
  onRefetch: () => void;
  // For future (search/filter controls), pass in as needed
}

export const ClientsCardGrid = ({
  clients,
  isLoading,
  onRefetch,
}: ClientsCardGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    // Show grid skeleton while loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
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
        <Button variant="outline" className="mt-4" onClick={onRefetch}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <Card
          key={client.id}
          className="hover:shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
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
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <Users className="h-7 w-7 text-gray-500" />
              </div>
            )}
            <div>
              <CardTitle className="text-base font-semibold leading-tight">
                {client.full_name || "Unknown"}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                {client.business_name || "—"}
              </div>
              <div className="text-xs mt-1">
                <span className="inline-block rounded bg-gray-900/60 px-2 py-0.5 mr-1 text-primary text-xs">
                  {client.status}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              {client.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3 mr-1" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3 mr-1" />
                  {client.phone}
                </div>
              )}
              {client.project_name && (
                <div>
                  <span className="font-medium">Project:</span> {client.project_name}
                </div>
              )}
            </div>
            <Button
              size="sm"
              className="w-full mt-4"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/clients/${client.id}`);
              }}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
