import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  image: string;
  quote: string;
  linkedinUrl?: string;
  videoUrl?: string;
}

export function TestimonialCard({ 
  name, 
  role, 
  company, 
  image, 
  quote, 
  linkedinUrl, 
  videoUrl 
}: TestimonialCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // [Analysis] Extract video ID from YouTube URL for thumbnail
  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split('embed/')[1]?.split('?')[0];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div 
      className="group h-full relative p-6 rounded-xl backdrop-blur-sm border-2 border-siso-orange/40 
        bg-black/30 transition-all duration-300 hover:scale-105 hover:border-siso-orange flex flex-col"
    >
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative h-12 w-12">
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={image}
              alt={name}
              className="h-12 w-12 rounded-full object-cover border-2 border-siso-orange/40"
            />
          </a>
        </div>
        <div className="text-left">
          <h4 className="text-white font-medium">{name}</h4>
          <p className="text-gray-400 text-sm">{role}</p>
          <p className="text-gray-400 text-sm">{company}</p>
        </div>
      </div>

      {/* Quote */}
      <p className="text-gray-300 italic text-left mb-4 flex-grow">{quote}</p>

      {/* Video Thumbnail Section */}
      {videoUrl && (
        <div className="relative rounded-lg overflow-hidden bg-black/20 aspect-video mt-auto">
          <img
            src={getYouTubeThumbnail(videoUrl)}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => setIsVideoOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 
              group-hover:bg-black/60 transition-colors duration-300"
          >
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm 
              group-hover:bg-white/20 transition-all duration-300">
              <Play className="w-8 h-8 text-white" />
            </div>
          </button>
        </div>
      )}

      {/* Video Modal */}
      <Dialog 
        open={isVideoOpen} 
        onOpenChange={setIsVideoOpen}
      >
        {videoUrl && (
          <iframe
            src={videoUrl}
            className="w-full aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </Dialog>
    </div>
  );
}