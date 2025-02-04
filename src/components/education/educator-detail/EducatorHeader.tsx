import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { Button } from '@/components/ui/button';
import { Youtube, Globe, Twitter, Linkedin, Share2, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

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
      <div className="relative h-[200px] md:h-[300px] w-full overflow-hidden rounded-t-xl">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={`${name}'s channel banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-siso-orange/20 to-siso-red/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="relative px-6 pb-6 -mt-16">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <img
              src={profileImage}
              alt={name}
              className="w-32 h-32 rounded-full object-cover border-4 border-siso-bg shadow-xl"
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 space-y-4 pt-16 md:pt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <GradientText
                  colors={["#FF5722", "#FFA726", "#FF5722"]}
                  animationSpeed={6}
                  className="text-4xl font-bold"
                >
                  {name}
                </GradientText>
                
                {/* Location and Join Date */}
                <div className="flex items-center gap-4 mt-2 text-siso-text/80">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  {formattedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formattedDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
            
            {description && (
              <p className="text-siso-text/80 text-lg">
                {description}
              </p>
            )}

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.youtube && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-4 h-4" />
                  </a>
                </Button>
              )}
              {socialLinks.website && (
                <Button variant="outline" size="icon" asChild>
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer">
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
      </div>
    </div>
  );
};