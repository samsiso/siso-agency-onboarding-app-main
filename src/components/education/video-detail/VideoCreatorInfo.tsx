
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface VideoCreatorInfoProps {
  channelName: string;
  channelAvatar: string;
  educatorSlug?: string;
}

export const VideoCreatorInfo = ({ 
  channelName, 
  channelAvatar, 
  educatorSlug 
}: VideoCreatorInfoProps) => {
  const navigate = useNavigate();
  const hasCreatorProfile = !!educatorSlug;

  return (
    <motion.div 
      className="flex items-center gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-12 h-12 rounded-full bg-white/10 overflow-hidden group">
        {channelAvatar ? (
          <img 
            src={channelAvatar} 
            alt={channelName} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const icon = document.createElement('div');
                icon.innerHTML = '<svg class="w-6 h-6 text-white/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>';
                parent.appendChild(icon);
              }
            }}
          />
        ) : (
          <Users className="w-6 h-6 text-white/60" />
        )}
      </div>

      <div className="flex-1">
        {hasCreatorProfile ? (
          <button
            onClick={() => educatorSlug && navigate(`/education/educators/${educatorSlug}`)}
            className="font-semibold text-white text-lg hover:text-siso-red transition-colors group"
          >
            {channelName}
            <span className="block text-sm text-gray-400 group-hover:text-siso-red/80">View Channel</span>
          </button>
        ) : (
          <div>
            <h3 className="font-semibold text-white text-lg">{channelName}</h3>
            <p className="text-sm text-gray-400">YouTube Channel</p>
          </div>
        )}
      </div>

      <Button 
        variant="secondary"
        size="sm"
        className="bg-white/5 hover:bg-white/10 transition-all duration-300"
      >
        Follow
      </Button>
    </motion.div>
  );
};
