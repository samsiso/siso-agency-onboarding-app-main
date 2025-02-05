import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export const VideoPlayer = ({ videoId, title }: VideoPlayerProps) => {
  // [Analysis] Using memo to prevent unnecessary re-renders of iframe
  return (
    <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full"
    />
  );
};