import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { CommunityMemberCard } from '@/components/community/CommunityMemberCard';
import { CommunityMemberDetails } from '@/components/community/CommunityMemberDetails';
import { CommunityMember } from '@/components/community/types';
import { GraduationCap, Brain, Users, School } from 'lucide-react';

export default function SisoEducation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['education-members'],
    queryFn: async () => {
      console.log('Fetching education and community members...');
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .in('category', ['education', 'community']);
      
      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }
      
      const transformedData = data.map(member => ({
        ...member,
        youtube_videos: member.youtube_videos as { title: string; url: string; }[] | null
      }));
      
      console.log('Fetched members:', transformedData);
      return transformedData as CommunityMember[];
    },
  });

  const filteredMembers = members?.filter(member => 
    !searchQuery || 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    console.error('Error in component:', error);
    return <div className="text-red-500">Error loading members. Please try again later.</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col space-y-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text mb-2">
                  SISO Education Hub
                </h1>
                <p className="text-siso-text/80 max-w-2xl">
                  Your gateway to quality AI education and expert insights
                </p>
              </div>
              <CommunitySearch 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* Education Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 border border-siso-text/10">
                <GraduationCap className="w-8 h-8 text-siso-red mb-3" />
                <h3 className="text-lg font-semibold text-siso-text-bold mb-2">Expert Education</h3>
                <p className="text-sm text-siso-text/80">Learn from industry professionals and AI experts</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 border border-siso-text/10">
                <Brain className="w-8 h-8 text-siso-orange mb-3" />
                <h3 className="text-lg font-semibold text-siso-text-bold mb-2">AI Mastery</h3>
                <p className="text-sm text-siso-text/80">Master the latest AI tools and technologies</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 border border-siso-text/10">
                <Users className="w-8 h-8 text-siso-red mb-3" />
                <h3 className="text-lg font-semibold text-siso-text-bold mb-2">Community Learning</h3>
                <p className="text-sm text-siso-text/80">Connect with fellow learners and educators</p>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 border border-siso-text/10">
                <School className="w-8 h-8 text-siso-orange mb-3" />
                <h3 className="text-lg font-semibold text-siso-text-bold mb-2">Structured Growth</h3>
                <p className="text-sm text-siso-text/80">Follow our balanced learning approach</p>
              </div>
            </div>
          </div>

          {/* Members Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-siso-text">Loading educational resources...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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