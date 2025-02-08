
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { Button } from '@/components/ui/button';
import { Youtube, Globe, Twitter, Linkedin, Share2, MapPin, Calendar, ImageOff, BookmarkPlus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EducatorHeaderProps {
  name: string;
  description?: string;
  profileImage?: string;
  bannerImage?: string;
  location?: string;
  joinedDate?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
}

export const EducatorHeader = ({ 
  name, 
  description, 
  profileImage,
  bannerImage,
  location,
  joinedDate,
  socialLinks = {}
}: EducatorHeaderProps) => {
  const formattedDate = joinedDate ? format(new Date(joinedDate), 'MMMM yyyy') : null;

  return (
    <div className="relative w-full">
      {/* Banner Image with Gradient Overlay */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        {bannerImage ? (
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            src={bannerImage}
            alt={`${name}'s channel banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Banner image failed to load:', bannerImage);
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-radial from-siso-orange/20 via-siso-red/20 to-black/40 flex items-center justify-center">
            <ImageOff className="w-16 h-16 text-siso-text/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6 -mt-32">
        <div className="flex flex-col md:flex-row gap-8 items-start max-w-7xl mx-auto">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={name}
                className="w-40 h-40 rounded-full object-cover border-4 border-siso-bg shadow-xl bg-siso-bg"
                onError={(e) => {
                  console.error('Profile image failed to load:', profileImage);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('fallback-avatar');
                }}
              />
            ) : (
              <div className="w-40 h-40 rounded-full border-4 border-siso-bg shadow-xl bg-siso-bg flex items-center justify-center">
                <ImageOff className="w-16 h-16 text-siso-text/30" />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <div className="flex-1 space-y-6 pt-16 md:pt-0">
            <div className="flex flex-col md:flex-row md:items-start gap-6 justify-between">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <GradientText
                    colors={["#FF5722", "#FFA726", "#FF5722"]}
                    animationSpeed={6}
                    className="text-5xl font-bold"
                  >
                    {name}
                  </GradientText>
                  
                  {/* Location and Join Date */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-siso-text/80">
                    {location && (
                      <div className="flex items-center gap-2 bg-siso-bg-alt px-3 py-1.5 rounded-full">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                      </div>
                    )}
                    {formattedDate && (
                      <div className="flex items-center gap-2 bg-siso-bg-alt px-3 py-1.5 rounded-full">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formattedDate}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="lg" className="gap-2">
                  <BookmarkPlus className="w-4 h-4" />
                  Follow
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
            
            {description && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-siso-text/90 text-lg leading-relaxed max-w-3xl"
              >
                {description}
              </motion.p>
            )}

            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-3"
            >
              {socialLinks.youtube && (
                <Button variant="outline" size="icon" className="rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors" asChild>
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {socialLinks.website && (
                <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-500/10 hover:text-blue-500 transition-colors" asChild>
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {socialLinks.twitter && (
                <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-500/10 hover:text-sky-500 transition-colors" asChild>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                </Button>
              )}
              {socialLinks.linkedin && (
                <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-600/10 hover:text-blue-600 transition-colors" asChild>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
