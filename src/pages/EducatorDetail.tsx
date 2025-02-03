import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Youtube, Globe, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { VideoLibrary } from '@/components/education/VideoLibrary';

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

interface EducatorData {
  id: string;
  name: string;
  description: string | null;
  member_type: string | null;
  youtube_url: string | null;
  youtube_videos: any[] | null; // Changed to handle Json type from database
  website_url: string | null;
  specialization: string[] | null;
  content_themes: string[] | null;
  profile_image_url: string | null;
  channel_avatar_url: string | null;
  channel_description: string | null;
  number_of_subscribers: number | null;
  video_count: number | null;
  channel_total_views: number | null;
  social_links: SocialLinks | null;
  slug: string | null;
}

export default function EducatorDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: educator, isLoading } = useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_creators')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      // Transform the data to match our EducatorData interface
      const transformedData: EducatorData = {
        ...data,
        youtube_videos: Array.isArray(data.youtube_videos) ? data.youtube_videos : [],
        social_links: typeof data.social_links === 'object' ? data.social_links : null
      };
      
      return transformedData;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-siso-bg-alt rounded-lg" />
            <div className="h-64 bg-siso-bg-alt rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!educator) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-siso-text">Educator not found</h1>
            <Button onClick={() => navigate('/education')}>
              Back to Education Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/education')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Education Hub
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 p-8 border border-siso-border shadow-lg backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <motion.img
                src={educator?.profile_image_url || educator?.channel_avatar_url}
                alt={educator?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-siso-orange/20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />

              <div className="flex-1 space-y-4">
                <GradientText
                  colors={["#FF5722", "#FFA726", "#FF5722"]}
                  animationSpeed={6}
                  className="text-4xl font-bold"
                >
                  {educator?.name}
                </GradientText>
                
                <p className="text-siso-text/80 text-lg">
                  {educator?.description || educator?.channel_description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-siso-orange">
                      {educator?.number_of_subscribers?.toLocaleString() || '0'}
                    </div>
                    <div className="text-siso-text/80">Subscribers</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-siso-orange">
                      {educator?.video_count?.toLocaleString() || '0'}
                    </div>
                    <div className="text-siso-text/80">Videos</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-siso-orange">
                      {educator?.channel_total_views?.toLocaleString() || '0'}
                    </div>
                    <div className="text-siso-text/80">Total Views</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {educator?.youtube_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={educator.youtube_url} target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {educator?.website_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={educator.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {educator?.social_links?.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={educator.social_links.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {educator?.social_links?.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={educator.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-siso-text">Latest Videos</h2>
            <VideoLibrary
              selectedEducator={educator}
              viewMode="grid"
              searchQuery=""
              isLoading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
