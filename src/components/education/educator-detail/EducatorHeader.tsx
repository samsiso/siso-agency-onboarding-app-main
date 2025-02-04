import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { Button } from '@/components/ui/button';
import { Youtube, Globe, Twitter, Linkedin } from 'lucide-react';

interface EducatorHeaderProps {
  name: string;
  description?: string;
  profileImage?: string;
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
  socialLinks = {}
}: EducatorHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <motion.img
        src={profileImage}
        alt={name}
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
          {name}
        </GradientText>
        
        {description && (
          <p className="text-siso-text/80 text-lg">
            {description}
          </p>
        )}

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
  );
};