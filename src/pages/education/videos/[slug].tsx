import VideoDetail from '@/pages/VideoDetail';
import { useParams } from 'react-router-dom';

// [Analysis] Dedicated page component for video detail route
export default function VideoDetailPage() {
  const { slug } = useParams();
  
  if (!slug) {
    return <div>Video not found</div>;
  }

  return <VideoDetail />;
}