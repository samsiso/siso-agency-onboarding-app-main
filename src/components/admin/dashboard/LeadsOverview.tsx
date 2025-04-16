
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCompactNumber, formatRelativeTime } from '@/lib/formatters';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InstagramLead {
  id: string;
  username: string;
  followers_count: number | null;
  status: string | null;
  created_at: string;
}

export const LeadsOverview = () => {
  const navigate = useNavigate();
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instagram_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  const viewAllLeads = () => {
    // In the future, we'll implement a dedicated leads management page
    // navigate('/admin/leads');
    console.log('View all leads clicked');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Leads</h2>
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'contacted':
        return <Badge className="bg-blue-500/20 text-blue-400">Contacted</Badge>;
      case 'converted':
        return <Badge className="bg-green-500/20 text-green-400">Converted</Badge>;
      case 'new':
      default:
        return <Badge className="bg-amber-500/20 text-amber-400">New</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Leads</h2>
        <Button variant="ghost" size="sm" onClick={viewAllLeads}>
          View all
        </Button>
      </div>
      <div className="space-y-4">
        {leads.length === 0 ? (
          <p className="text-muted-foreground">No leads found.</p>
        ) : (
          leads.map((lead: InstagramLead) => (
            <div key={lead.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">@{lead.username}</p>
                <p className="text-sm text-muted-foreground">
                  {getStatusBadge(lead.status)} • {formatRelativeTime(lead.created_at)}
                </p>
              </div>
              <span className="text-sm">
                {lead.followers_count ? `${formatCompactNumber(lead.followers_count)} followers` : 'N/A'}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
