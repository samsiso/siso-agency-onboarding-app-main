import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { EducatorHeader } from '@/components/education/educator-detail/EducatorHeader';
import { EducatorStats } from '@/components/education/educator-detail/EducatorStats';
import { EducatorVideoSection } from '@/components/education/educator-detail/EducatorVideoSection';
import { EducatorLoadingScreen } from '@/components/education/educator-detail/EducatorLoadingScreen';
import { useEducatorDetails } from '@/hooks/use-education-queries';
import { toast } from 'sonner';

export default function EducatorDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // [Analysis] Using slug to fetch educator details first
  const { data: educator, isLoading, error } = useEducatorDetails(slug || '');

  // Add debug log to track educator data
  console.log('EducatorDetail received data:', educator);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/education')}
            className="m-4 md:m-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Education Hub
          </Button>
          <EducatorLoadingScreen />
        </div>
      </div>
    );
  }

  if (error || !educator) {
    toast.error('Failed to load educator details');
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
        <meta property="og:image" content={educator.channel_avatar_url || ''} />
      </Helmet>

      <Sidebar />
      <div className="flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Section */}
          <div className="p-4 md:p-8 space-y-4">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/education/educators')}
              className="group flex items-center gap-2 text-siso-text/70 hover:text-siso-text-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Educators
            </Button>
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-siso-text/60">
              <Button 
                variant="link" 
                className="p-0 text-siso-text/60 hover:text-siso-text-bold"
                onClick={() => navigate('/education')}
              >
                Education Hub
              </Button>
              <ChevronRight className="w-4 h-4" />
              <Button 
                variant="link" 
                className="p-0 text-siso-text/60 hover:text-siso-text-bold"
                onClick={() => navigate('/education/educators')}
              >
                Educators
              </Button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-siso-text-bold">{educator.name}</span>
            </nav>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EducatorHeader
              name={educator.name}
              description={educator.channel_description || educator.description}
              profileImage={educator.channel_avatar_url || educator.profile_image_url}
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