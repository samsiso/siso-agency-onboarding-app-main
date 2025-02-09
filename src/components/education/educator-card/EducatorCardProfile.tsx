
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface EducatorCardProfileProps {
  name: string;
  avatarUrl?: string;
  onAvatarLoad: () => void;
  onAvatarError: () => void;
  avatarLoaded: boolean;
  avatarError: boolean;
}

export const EducatorCardProfile = ({
  name,
  avatarUrl,
  onAvatarLoad,
  onAvatarError,
  avatarLoaded,
  avatarError
}: EducatorCardProfileProps) => {
  return (
    <div className="relative px-6 -mt-10">
      <motion.div 
        className="relative h-20 w-20 rounded-2xl overflow-hidden ring-4 ring-siso-bg"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {avatarUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: avatarLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {!avatarError ? (
              <AspectRatio ratio={1} className="h-full">
                <img
                  src={avatarUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                  onLoad={onAvatarLoad}
                  onError={onAvatarError}
                  loading="lazy"
                />
              </AspectRatio>
            ) : (
              <div className="h-full w-full bg-siso-bg-alt flex items-center justify-center">
                <User className="w-8 h-8 text-siso-text/70" />
              </div>
            )}
          </motion.div>
        ) : (
          <div className="h-full w-full bg-siso-bg-alt flex items-center justify-center">
            <User className="w-8 h-8 text-siso-text/70" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

