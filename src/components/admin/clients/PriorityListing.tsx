
import { useClientsList } from '@/hooks/client';
import { PriorityCard } from './PriorityCard';

interface PriorityListingProps {
  limit?: number;
}

export function PriorityListing({ limit = 3 }: PriorityListingProps) {
  const { clients, isLoading } = useClientsList({
    // Get only important clients for this section
    pageSize: 10,
    sortColumn: 'priority',
    sortDirection: 'desc'
  });

  // Filter to only get high priority clients
  const priorityClients = clients
    .filter(client => client.priority === 'high')
    .slice(0, limit);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">Priority Clients</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-black/30 border border-siso-text/10 rounded-lg p-4 animate-pulse h-32">
              <div className="h-6 w-1/2 bg-siso-text/10 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-siso-text/10 rounded mb-4"></div>
              <div className="h-4 w-1/3 bg-siso-text/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (priorityClients.length === 0) {
    return null; // Don't show this section if no priority clients
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-3">Priority Clients</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priorityClients.map((client) => (
          <PriorityCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
