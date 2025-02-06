import { VideoDetail } from '@/pages/VideoDetail';
import { useParams } from 'react-router-dom';

export default function VideoDetailPage() {
  const { slug } = useParams();
  
  if (!slug) {
    return <div>Video not found</div>;
  }

  return <VideoDetail />;
}