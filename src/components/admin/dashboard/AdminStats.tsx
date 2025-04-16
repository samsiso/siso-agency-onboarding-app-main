
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { formatCompactNumber } from '@/lib/formatters';
import { Loader2, Users, ClipboardList, Inbox } from 'lucide-react';

export const AdminStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [leads, clients, plans, onboarding] = await Promise.all([
        supabase.from('instagram_leads').select('count').single(),
        supabase.from('client_onboarding').select('count').single(),
        supabase.from('plans').select('count').single(),
        supabase.from('onboarding').select('count').single(),
      ]);
      
      return {
        totalLeads: leads.count || 0,
        totalClients: clients.count || 0,
        totalPlans: plans.count || 0,
        totalOnboarding: onboarding.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Loading...</p>
              <div className="h-6 w-16 bg-gray-800/50 animate-pulse rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Leads",
      value: stats?.totalLeads ?? 0,
      icon: Inbox,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Active Clients",
      value: stats?.totalClients ?? 0,
      icon: Users,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Plans Created",
      value: stats?.totalPlans ?? 0,
      icon: ClipboardList,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    },
    {
      title: "Onboarding",
      value: stats?.totalOnboarding ?? 0,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className="p-6 flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center`}>
            <item.icon className={`w-6 h-6 ${item.color}`} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
            <h3 className="text-2xl font-bold">{formatCompactNumber(item.value)}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
};
