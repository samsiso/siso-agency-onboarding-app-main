import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { GraduationCap } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { EducationNav } from '@/components/education/EducationNav';
import { VideoLibrary } from '@/components/education/VideoLibrary';
import { EducatorsDirectory } from '@/components/education/EducatorsDirectory';

export default function SisoEducation() {
  const [activeSection, setActiveSection] = useState<'videos' | 'educators'>('videos');

  const { data: members, isLoading } = useQuery({
    queryKey: ['education-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_creators')
        .select('*');
      
      if (error) throw error;
      
      return data.map(member => ({
        id: member.id,
        name: member.name,
        description: member.description,
        member_type: member.member_type,
        youtube_url: member.youtube_url,
        youtube_videos: Array.isArray(member.youtube_videos) 
          ? member.youtube_videos.map((video: any) => ({
              title: video.title || '',
              url: video.url || ''
            }))
          : [],
        website_url: member.website_url,
        specialization: member.specialization,
        content_themes: member.content_themes,
        profile_image_url: member.profile_image_url,
        member_count: null,
        join_url: null,
        platform: null,
        points: 0,
        rank: null,
        contribution_count: 0,
        referral_count: 0
      }));
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 p-8 border border-siso-border shadow-lg backdrop-blur-sm">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-siso-orange" />
                <GradientText
                  colors={["#FF5722", "#FFA726", "#FF5722"]}
                  animationSpeed={6}
                  className="text-4xl font-bold"
                >
                  SISO EDUCATION HUB
                </GradientText>
              </div>
              <p className="text-siso-text/80 max-w-2xl mb-8 text-lg">
                Access quality AI education and expert insights. Learn from industry leaders and stay ahead in the rapidly evolving world of artificial intelligence.
              </p>
            </div>
          </div>

          {/* List Learner Callout Box */}
          <Alert className="border border-[#0FA0CE]/20 bg-gradient-to-r from-[#0FA0CE]/5 to-transparent backdrop-blur-sm rounded-xl shadow-lg">
            <AlertDescription className="flex items-center justify-between gap-4 p-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#0FA0CE] mb-1">Scale Your Learning Programs</h3>
                <p className="text-siso-text/90">
                  List Learner is a powerful B2B education infrastructure platform - perfect for agencies, businesses, and individuals looking to scale their learning programs.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="shrink-0 border-[#0FA0CE] text-[#0FA0CE] hover:bg-[#0FA0CE]/10 hover:text-[#0FA0CE] transition-all shadow-sm"
              >
                <a 
                  href="https://demo.listlearner.com/?ref=sourcesiso" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2"
                >
                  Try it Free <ExternalLink size={16} />
                </a>
              </Button>
            </AlertDescription>
          </Alert>

          {/* Navigation */}
          <EducationNav
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeSection === 'videos' ? (
              <VideoLibrary
                key="video-library"
                isLoading={isLoading}
                selectedEducator={null}
              />
            ) : (
              <EducatorsDirectory
                key="educators-directory"
                members={members}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}