
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

export const AdminStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [leads, clients, plans] = await Promise.all([
        supabase.from('instagram_leads').select('count').single(),
        supabase.from('client_onboarding').select('count').single(),
        supabase.from('plans').select('count').single(),
      ]);
      
      return {
        totalLeads: leads.count || 0,
        totalClients: clients.count || 0,
        totalPlans: plans.count || 0,
      };
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
        <h3 className="text-2xl font-bold">{stats?.totalLeads ?? 0}</h3>
      </Card>
      <Card className="p-6">
        <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
        <h3 className="text-2xl font-bold">{stats?.totalClients ?? 0}</h3>
      </Card>
      <Card className="p-6">
        <p className="text-sm font-medium text-muted-foreground">Plans Created</p>
        <h3 className="text-2xl font-bold">{stats?.totalPlans ?? 0}</h3>
      </Card>
    </div>
  );
};
