import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export const VideoPlayer = ({ videoId, title }: VideoPlayerProps) => {
  return (
    <div className="rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
      <AspectRatio ratio={16 / 9}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};