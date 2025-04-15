
import { useInstagramLeads } from '@/hooks/useInstagramLeads';
import { Card } from '@/components/ui/card';

export const LeadsOverview = () => {
  const { leads } = useInstagramLeads();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Recent Leads</h2>
      <div className="space-y-4">
        {leads.slice(0, 5).map((lead) => (
          <div key={lead.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{lead.username}</p>
              <p className="text-sm text-muted-foreground">{lead.status}</p>
            </div>
            <span className="text-sm">
              {lead.followers_count ? `${lead.followers_count} followers` : 'N/A'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
