import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { CommunityMemberCard } from '@/components/community/CommunityMemberCard';
import { CommunityMemberDetails } from '@/components/community/CommunityMemberDetails';
import { CommunityMember } from '@/components/community/types';
import { Database } from '@/integrations/supabase/types';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'networking-featured', label: 'Featured' },
  { id: 'networking-school', label: 'School' },
  { id: 'networking-discord', label: 'Discord' },
  { id: 'networking-general', label: 'General' },
];

export default function Networking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  const { data: members, isLoading } = useQuery({
    queryKey: ['networking-members', selectedCategory],
    queryFn: async () => {
      console.log('Fetching networking members...');
      let query = supabase
        .from('tools')
        .select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      } else {
        query = query.like('category', 'networking-%');
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching networking members:', error);
        throw error;
      }
      
      console.log('Fetched networking members:', data);

      // Transform the data to match CommunityMember type
      const transformedData: CommunityMember[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        member_type: item.member_type,
        youtube_url: item.youtube_url,
        youtube_videos: Array.isArray(item.youtube_videos) 
          ? item.youtube_videos.map((video: any) => ({
              title: video.title || '',
              url: video.url || ''
            }))
          : null,
        website_url: item.website_url,
        specialization: item.specialization,
        content_themes: item.content_themes,
        profile_image_url: item.profile_image_url
      }));

      return transformedData;
    },
  });

  const filteredMembers = members?.filter(member => 
    !searchQuery || 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                SISO Networking Hub
              </h1>
              <CommunitySearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
            <p className="text-siso-text/80">
              Connect with the best communities and expand your network in the SISO ecosystem.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-siso-text/10 data-[state=active]:bg-siso-red/20 text-siso-text"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {isLoading ? (
                  <div className="text-siso-text">Loading...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMembers?.map((member) => (
                      <CommunityMemberCard
                        key={member.id}
                        member={member}
                        onClick={setSelectedMember}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <CommunityMemberDetails
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        </div>
      </div>
    </div>
  );
}