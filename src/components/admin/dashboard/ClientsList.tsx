
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/formatters';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ClientsList = () => {
  const navigate = useNavigate();
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_onboarding')
        .select(`
          *,
          profiles:user_id(full_name, id)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  const viewAllClients = () => {
    // In the future, we'll implement a dedicated clients management page
    // navigate('/admin/clients');
    console.log('View all clients clicked');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Clients</h2>
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500/20 text-blue-400">In Progress</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-500/20 text-amber-400">Pending</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Clients</h2>
        <Button variant="ghost" size="sm" onClick={viewAllClients}>
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {clients.length === 0 ? (
          <p className="text-muted-foreground">No clients found.</p>
        ) : (
          clients.map((client: any) => (
            <div key={client.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {client.profiles?.full_name || 'Unknown'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Step {client.current_step} of {client.total_steps} • {formatRelativeTime(client.updated_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(client.status)}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => client.profiles?.id && navigate(`/admin/clients/${client.profiles.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
