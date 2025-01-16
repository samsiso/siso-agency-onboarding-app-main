import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { CommunityMemberCard } from '@/components/community/CommunityMemberCard';
import { CommunityMemberDetails } from '@/components/community/CommunityMemberDetails';
import { CommunityMember } from '@/components/community/types';
import { Sidebar } from '@/components/Sidebar';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Search, Filter, Youtube } from 'lucide-react';

export default function Networking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  const { data: members, isLoading } = useQuery({
    queryKey: ['networking-members', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('tools')
        .select('*');
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      } else {
        query = query.or('category.eq.networking-featured,category.eq.networking-school,category.eq.networking-discord,category.eq.networking-general');
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(item => ({
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
      })) as CommunityMember[];
    },
  });

  const categoryCounts = {
    all: members?.length || 0,
    featured: members?.filter(m => m.member_type === 'featured').length || 0,
    school: members?.filter(m => m.member_type === 'school').length || 0,
    discord: members?.filter(m => m.member_type === 'discord').length || 0,
    general: members?.filter(m => m.member_type === 'general').length || 0,
  };

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
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
                  SISO Networking Hub
                </h1>
                <p className="mt-2 text-lg text-siso-text/80">
                  Connect with the best communities and expand your network in the SISO ecosystem.
                </p>
              </div>
              <CommunitySearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* New Callouts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Users className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Community Members:</span> Discover and connect with featured creators, educators, and community leaders.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Search className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Quick Search:</span> Find specific members by name or browse through their specializations.
                </AlertDescription>
              </Alert>
              
              <Alert className="bg-siso-text/5 border border-siso-text/10">
                <Youtube className="h-4 w-4 text-siso-orange" />
                <AlertDescription className="text-siso-text/80">
                  <span className="font-semibold text-siso-text">Content Access:</span> View member profiles to access their YouTube content, websites, and educational resources.
                </AlertDescription>
              </Alert>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
              <TabsList className="w-full justify-start bg-siso-text/5 border border-siso-text/10 flex-wrap">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
                >
                  All
                  <span className="ml-2 text-sm text-siso-text/60">
                    {categoryCounts.all}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="featured"
                  className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
                >
                  Featured
                  <span className="ml-2 text-sm text-siso-text/60">
                    {categoryCounts.featured}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="school"
                  className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
                >
                  School
                  <span className="ml-2 text-sm text-siso-text/60">
                    {categoryCounts.school}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="discord"
                  className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
                >
                  Discord
                  <span className="ml-2 text-sm text-siso-text/60">
                    {categoryCounts.discord}
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="general"
                  className="data-[state=active]:bg-siso-orange/20 data-[state=active]:text-siso-orange"
                >
                  General
                  <span className="ml-2 text-sm text-siso-text/60">
                    {categoryCounts.general}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="h-48 rounded-lg bg-siso-text/5 animate-pulse"
                />
              ))}
            </div>
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

          <CommunityMemberDetails
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        </div>
      </div>
    </div>
  );
}