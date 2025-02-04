import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { toast } from '@/components/ui/use-toast';
import { EducatorHeader } from '@/components/education/educator-detail/EducatorHeader';
import { EducatorStats } from '@/components/education/educator-detail/EducatorStats';
import { EducatorVideoSection } from '@/components/education/educator-detail/EducatorVideoSection';

export default function EducatorDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: educator, isLoading, error } = useQuery({
    queryKey: ['educator', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Invalid slug');

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
        console.error('Supabase query error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Educator not found');
      }

      return data;
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Query error:', error);
          toast({
            description: "The requested educator could not be found or accessed.",
            variant: "destructive"
          });
        }
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-siso-red border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !educator) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center gap-4">
          <div className="text-xl text-siso-text">Educator not found</div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/education')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Education Hub
          </Button>
        </div>
      </div>
    );
  }

  // Parse social links from JSON if they exist
  const socialLinks = typeof educator.social_links === 'string' 
    ? JSON.parse(educator.social_links)
    : (educator.social_links || {});

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Helmet>
        <title>{`${educator.name} | SISO Education`}</title>
        <meta name="description" content={educator.description || ''} />
        <meta property="og:title" content={educator.name} />
        <meta property="og:description" content={educator.description || ''} />
        <meta property="og:image" content={educator.profile_image_url || educator.channel_avatar_url || ''} />
      </Helmet>

      <Sidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/education')}
            className="m-4 md:m-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Education Hub
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EducatorHeader
              name={educator.name}
              description={educator.description || educator.channel_description}
              profileImage={educator.profile_image_url || educator.channel_avatar_url}
              bannerImage={educator.channel_banner_url}
              location={educator.channel_location}
              joinedDate={educator.channel_joined_date}
              socialLinks={{
                youtube: educator.youtube_url,
                website: educator.website_url,
                twitter: socialLinks.twitter,
                linkedin: socialLinks.linkedin
              }}
            />

            <div className="px-4 md:px-8 -mt-8 relative z-10">
              <EducatorStats
                subscriberCount={educator.number_of_subscribers}
                videoCount={educator.channel_total_videos}
                totalViews={educator.channel_total_views}
              />

              <div className="mt-8">
                <EducatorVideoSection educatorId={educator.id} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}