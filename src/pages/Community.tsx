import { useQuery } from '@tanstack/react-query';
import { Youtube, ExternalLink, Users, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Json } from '@/integrations/supabase/types';

interface CommunityMember {
  id: string;
  name: string;
  description: string | null;
  member_type: string;
  youtube_url: string | null;
  youtube_videos: {
    title: string;
    url: string;
  }[] | null;
  website_url: string | null;
  specialization: string[] | null;
  content_themes: string[] | null;
  profile_image_url: string | null;
}

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['community-members'],
    queryFn: async () => {
      console.log('Fetching community members...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('category', 'community');
      
      if (error) {
        console.error('Error fetching community members:', error);
        throw error;
      }
      
      // Transform the data to match CommunityMember type
      const transformedData = data.map(member => ({
        ...member,
        youtube_videos: member.youtube_videos as { title: string; url: string; }[] | null
      }));
      
      console.log('Fetched community members:', transformedData);
      return transformedData as CommunityMember[];
    },
  });

  const filteredMembers = members?.filter(member => 
    !searchQuery || 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMemberClick = (member: CommunityMember) => {
    setSelectedMember(member);
  };

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading community members. Please try again later.</div>;
  }

  const renderMemberCard = (member: CommunityMember) => (
    <Card 
      key={member.id} 
      className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
      onClick={() => handleMemberClick(member)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {member.profile_image_url ? (
            <img 
              src={member.profile_image_url} 
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-siso-orange" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-siso-text-bold truncate">{member.name}</h3>
            <p className="text-xs text-siso-text/80 capitalize">{member.member_type}</p>
          </div>
        </div>
        {member.description && (
          <p className="mt-2 text-xs text-siso-text line-clamp-2">
            {member.description}
          </p>
        )}
        {member.specialization && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.specialization.slice(0, 2).map((spec, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 rounded-full bg-siso-text/10 text-siso-text"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h1 className="text-4xl font-bold text-siso-text-bold">
                The AI Community
              </h1>
              <div className="relative w-full md:w-96">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/60" />
                <Input
                  placeholder="Search community members..."
                  className="pl-10 bg-siso-text/5 border-siso-text/10 focus-visible:ring-siso-orange"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-siso-text">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMembers?.map((member) => renderMemberCard(member))}
            </div>
          )}

          <Sheet open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
            <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
              {selectedMember && (
                <>
                  <SheetHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedMember.profile_image_url && (
                          <img 
                            src={selectedMember.profile_image_url} 
                            alt={selectedMember.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                            {selectedMember.name}
                          </SheetTitle>
                          <p className="text-sm text-siso-text/80 capitalize">{selectedMember.member_type}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setSelectedMember(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <SheetDescription className="text-siso-text">
                      {selectedMember.description}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        {selectedMember.website_url && (
                          <Button
                            className="w-full justify-start gap-2"
                            onClick={() => window.open(selectedMember.website_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Visit Website
                          </Button>
                        )}
                        {selectedMember.youtube_url && (
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => window.open(selectedMember.youtube_url!, '_blank')}
                          >
                            <Youtube className="h-4 w-4 text-red-500" />
                            Visit YouTube Channel
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Specializations */}
                    {selectedMember.specialization && selectedMember.specialization.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.specialization.map((spec, index) => (
                            <span 
                              key={index}
                              className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Themes */}
                    {selectedMember.content_themes && selectedMember.content_themes.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-siso-text-bold">Content Themes</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.content_themes.map((theme, index) => (
                            <span 
                              key={index}
                              className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}