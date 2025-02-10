
import { User } from 'lucide-react';
import { Video } from '../types';

interface VideoMetadataProps {
  educator: Video['educator'];
  metrics: Video['metrics'];
}

export const VideoMetadata = ({ educator, metrics }: VideoMetadataProps) => {
  return (
    <div className="flex items-center gap-2">
      {educator.avatar_url ? (
        <img
          src={educator.avatar_url}
          alt={educator.name}
          className="w-6 h-6 rounded-full ring-1 ring-siso-border"
          loading="lazy"
        />
      ) : (
        <div className="w-6 h-6 rounded-full bg-siso-bg flex items-center justify-center ring-1 ring-siso-border">
          <User className="w-3 h-3 text-siso-text/70" />
        </div>
      )}
      <span className="text-sm font-medium text-siso-text/80 truncate">
        {educator.name}
      </span>
    </div>
  );
};
