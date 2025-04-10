
import { useInfiniteQuery } from '@tanstack/react-query';
import { Educator } from './types';
import { safeSupabase } from '@/utils/supabaseHelpers';
import FeatureFlags from '@/utils/featureFlags';

interface EducatorPage {
  educators: Educator[];
  nextCursor: string | undefined;
}

// Create mock educators data
const getMockEducators = (page: number = 1): Educator[] => {
  const startIdx = (page - 1) * 12;
  return Array.from({ length: 12 }, (_, i) => {
    const idx = startIdx + i;
    return {
      id: `mock-educator-${idx}`,
      name: `Educator ${idx + 1}`,
      description: `This is a description for Educator ${idx + 1}`,
      specialization: ['React', 'TypeScript', 'JavaScript'],
      profile_image_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`,
      channel_avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`,
      channel_banner_url: '',
      number_of_subscribers: Math.floor(Math.random() * 100000),
      channel_total_videos: Math.floor(Math.random() * 200),
      channel_location: 'United States',
      slug: `educator-${idx + 1}`,
      featured_videos: [],
      is_featured: idx < 3,
      member_count: Math.floor(Math.random() * 5000)
    };
  });
};

// [Analysis] Convert to infinite query for better UX and performance
export const useEducatorsList = (searchQuery: string) => {
  // Only fetch if education feature is enabled
  const isEnabled = FeatureFlags.education;

  return useInfiniteQuery<EducatorPage>({
    queryKey: ['educators', searchQuery, isEnabled],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      console.log('Fetching educators for cursor:', pageParam); // Debug log
      
      // If feature is disabled, use mock data
      if (!isEnabled) {
        const page = pageParam ? parseInt(pageParam.split('-')[1]) : 1;
        const mockEducators = getMockEducators(page);
        
        return {
          educators: mockEducators,
          nextCursor: page < 3 ? `page-${page + 1}` : undefined
        };
      }
      
      // Feature is enabled, fetch from the database
      let query = safeSupabase
        .from('education_creators')
        .select(`
          id,
          name,
          description,
          specialization,
          profile_image_url,
          channel_avatar_url,
          channel_banner_url,
          number_of_subscribers,
          channel_total_videos,
          channel_location,
          slug,
          featured_videos,
          is_featured,
          member_count
        `)
        .order('number_of_subscribers', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // [Analysis] Use cursor-based pagination for better performance
      if (pageParam) {
        query = query.lt('id', pageParam);
      }

      query = query.limit(12);

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching educators:', error);
        throw error;
      }

      // Transform the data to match Educator type
      const educators = (data || []).map(item => ({
        id: item.id || `mock-${Math.random()}`,
        name: item.name || 'Unnamed Educator',
        description: item.description || '',
        specialization: item.specialization || [],
        profile_image_url: item.profile_image_url || '',
        channel_avatar_url: item.channel_avatar_url || '',
        channel_banner_url: item.channel_banner_url || '',
        number_of_subscribers: item.number_of_subscribers || 0,
        channel_total_videos: item.channel_total_videos || 0,
        channel_location: item.channel_location || '',
        slug: item.slug || '',
        featured_videos: Array.isArray(item.featured_videos) 
          ? (item.featured_videos as any[]).map(v => String(v))  // Convert to string[]
          : [],
        is_featured: item.is_featured || false,
        member_count: item.member_count || 0
      }));
      
      return {
        educators,
        nextCursor: data?.length === 12 ? data[data.length - 1].id : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
