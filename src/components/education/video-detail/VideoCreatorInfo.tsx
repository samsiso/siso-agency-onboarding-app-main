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

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
        {channelAvatar ? (
          <img 
            src={channelAvatar} 
            alt={channelName} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Users className="w-6 h-6 text-white/60" />
        )}
      </div>
      <div>
        {educatorSlug ? (
          <button
            onClick={() => navigate(`/education/educators/${educatorSlug}`)}
            className="font-semibold text-white text-lg hover:text-siso-red transition-colors"
          >
            {channelName}
          </button>
        ) : (
          <h3 className="font-semibold text-white text-lg">{channelName}</h3>
        )}
        <p className="text-sm text-gray-400">Creator</p>
      </div>
    </div>
  );
};