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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative p-6 rounded-xl backdrop-blur-sm border border-siso-orange/20 
        bg-black/30 transition-all duration-300 hover:scale-105 hover:border-siso-orange/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              className="h-12 w-12 rounded-full object-cover border-2 border-siso-orange/20"
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
      <p className="text-gray-300 italic text-left mb-4">"{quote}"</p>

      {/* Video Section */}
      {videoUrl && (
        <div className="relative rounded-lg overflow-hidden bg-black/20 ring-1 ring-white/10">
          <video
            src={videoUrl}
            className="w-full aspect-video object-cover"
            autoPlay={isHovered}
            loop
            muted
            playsInline
          />
          <button
            onClick={() => setIsVideoOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Play className="w-12 h-12 text-white" />
          </button>
        </div>
      )}

      {/* Video Modal */}
      <Dialog 
        open={isVideoOpen} 
        onOpenChange={setIsVideoOpen}
      >
        {videoUrl && (
          <video
            src={videoUrl}
            className="w-full aspect-video rounded-lg"
            controls
            autoPlay
          />
        )}
      </Dialog>
    </div>
  );
}