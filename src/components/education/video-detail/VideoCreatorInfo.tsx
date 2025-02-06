
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // [Analysis] Render differently based on whether we have a full creator profile or just basic info
  const hasCreatorProfile = !!educatorSlug;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
        {channelAvatar ? (
          <img 
            src={channelAvatar} 
            alt={channelName} 
            className="w-full h-full rounded-full object-cover"
            onError={(e) => {
              console.log('[VideoCreatorInfo] Avatar failed to load:', channelAvatar);
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
      <div>
        {hasCreatorProfile ? (
          <button
            onClick={() => navigate(`/education/educators/${educatorSlug}`)}
            className="font-semibold text-white text-lg hover:text-siso-red transition-colors"
          >
            {channelName}
          </button>
        ) : (
          <h3 className="font-semibold text-white text-lg">{channelName}</h3>
        )}
        <p className="text-sm text-gray-400">
          {hasCreatorProfile ? 'Creator' : 'YouTube Channel'}
        </p>
      </div>
    </div>
  );
};
