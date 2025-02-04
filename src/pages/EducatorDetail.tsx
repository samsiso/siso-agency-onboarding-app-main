import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Youtube, Globe, Twitter, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { VideoLibrary } from '@/components/education/VideoLibrary';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type SocialLinks = {
  twitter?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

type YoutubeVideo = {
  id: string;
  title: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  date: string | null;
  duration: string | null;
  viewCount: number | null;
}

type Educator = Database['public']['Tables']['education_creators']['Row'] & {
  youtube_videos?: YoutubeVideo[];
}

export default function EducatorDetail() {
  console.log('EducatorDetail component mounting...'); // Debug log
  const { slug } = useParams();
  const navigate = useNavigate();

  console.log('Current slug:', slug); // Debug log

  const { data: educator, isLoading, error } = useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      console.log('Executing query for slug:', slug); // Debug log
      
      const { data, error } = await supabase
        .from('education_creators')
        .select(`
          *,
          youtube_videos (
            id,
            title,
            url,
            thumbnailUrl,
            date,
            duration,
            viewCount
          )
        `)
        .eq('slug', slug)
        .maybeSingle();
      
      if (error) {
        console.error('Supabase query error:', error); // Debug log
        throw error;
      }
      
      if (!data) {
        console.log('No educator found with slug:', slug); // Debug log
        throw new Error('Educator not found');
      }
      
      console.log('Found educator data:', data); // Debug log

      // Transform the data to match our expected type
      const transformedData: Educator = {
        ...data,
        youtube_videos: Array.isArray(data.youtube_videos) 
          ? data.youtube_videos.map((video: any) => ({
              id: video?.id || '',
              title: video?.title || null,
              url: video?.url || null,
              thumbnailUrl: video?.thumbnailUrl || null,
              date: video?.date || null,
              duration: video?.duration || null,
              viewCount: typeof video?.viewCount === 'number' ? video.viewCount : null
            }))
          : []
      };
      
      return transformedData;
    },
    retry: 1,
  });

  if (error) {
    console.error('Error in component:', error); // Debug log
    toast.error('Failed to load educator profile');
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-siso-text">
              {error instanceof Error ? error.message : 'Failed to load educator profile'}
            </h1>
            <Button onClick={() => navigate('/education')}>
              Back to Education Hub
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log('Showing loading state'); // Debug log
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
    console.log('No educator data available'); // Debug log
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

  console.log('Rendering educator profile:', educator); // Debug log

  // Parse social links from JSON if they exist
  const socialLinks: SocialLinks = typeof educator.social_links === 'string' 
    ? JSON.parse(educator.social_links)
    : (educator.social_links as SocialLinks) || {};

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
                src={educator.profile_image_url || educator.channel_avatar_url}
                alt={educator.name}
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
                  {educator.name}
                </GradientText>
                
                <p className="text-siso-text/80 text-lg">
                  {educator.description || educator.channel_description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-siso-orange">
                      {educator.number_of_subscribers?.toLocaleString() || '0'}
                    </div>
                    <div className="text-siso-text/80">Subscribers</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-siso-orange">
                      {educator.video_count?.toLocaleString() || '0'}
                    </div>
                    <div className="text-siso-text/80">Videos</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-2xl font-bold text-siso-orange">
                      {educator.channel_total_views?.toLocaleString() || '0'}
                    </div>
                    <div className="text-siso-text/80">Total Views</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {educator.youtube_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={educator.youtube_url} target="_blank" rel="noopener noreferrer">
                        <Youtube className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {educator.website_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={educator.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {socialLinks.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {socialLinks.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
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
              selectedEducator={educator.id}
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
};
