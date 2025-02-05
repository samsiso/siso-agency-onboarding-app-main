// [Analysis] Core iframe component with minimal responsibilities
export const VideoPlayerFrame = ({ videoId, title }: { videoId: string; title: string }) => {
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