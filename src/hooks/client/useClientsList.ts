
import { useQuery } from '@tanstack/react-query';
import { buildClientListQuery, processClientData } from '@/utils/clientQueryBuilders';
import { fetchClientsFallback } from '@/utils/clientFallbackUtils';
import { ClientsListParams, ClientsListResponse } from '@/types/client.types';

export type { ClientData, ClientsListParams } from '@/types/client.types';

export const useClientsList = ({
  page = 1,
  pageSize = 10,
  searchQuery = '',
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: ClientsListParams = {}) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clients-list', page, pageSize, searchQuery, statusFilter, sortColumn, sortDirection],
    queryFn: async () => {
      try {
        // Build and execute the main query
        const query = buildClientListQuery({ searchQuery, statusFilter, sortColumn, sortDirection });
        
        // First get count
        let count = 0;
        try {
          const countResult = await query;
          if (countResult && typeof countResult.count === 'number') {
            count = countResult.count;
          }
        } catch (countError) {
          console.error('Error getting count:', countError);
        }
        
        // Then fetch the page of data
        const { data, error: dataError } = await query.range(from, to);
        
        if (dataError) {
          console.error('Error fetching clients data:', dataError);
          throw dataError;
        }
        
        if (!data || data.length === 0) {
          return {
            clients: [],
            totalCount: 0
          };
        }
        
        // Process the data to flatten the structure
        const processedData = processClientData(data);
        
        return {
          clients: processedData,
          totalCount: count
        };
      } catch (error: any) {
        console.error('Error in useClientsList:', error);
        
        // Use fallback mechanism if main query fails
        return fetchClientsFallback({ page, pageSize, searchQuery, statusFilter, sortColumn, sortDirection }, from, to);
      }
    },
  });

  return {
    clients: data?.clients || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch
  };
};
