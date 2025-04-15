
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

export const ClientsList = () => {
  const { data: clients = [] } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_onboarding')
        .select(`
          *,
          profiles:profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Clients</h2>
      <div className="space-y-4">
        {clients.map((client: any) => (
          <div key={client.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{client.profiles?.full_name || 'Unknown'}</p>
              <p className="text-sm text-muted-foreground">
                Step {client.current_step} of {client.total_steps}
              </p>
            </div>
            <span className="capitalize text-sm">{client.status}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
