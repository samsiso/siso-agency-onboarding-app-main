
import { useParams, useSearchParams } from 'react-router-dom';
import { extractVideoIdFromSlug } from '@/utils/slugUtils';
import { Helmet } from 'react-helmet';
import { useVideoDetail } from '@/hooks/useVideoDetail';
import { LoadingState } from '@/components/education/video-detail/LoadingState';
import { ErrorState } from '@/components/education/video-detail/ErrorState';
import { VideoBreadcrumbs } from '@/components/education/video-detail/VideoBreadcrumbs';
import { VideoDetailLayout } from '@/components/education/video-detail/VideoDetailLayout';

export default function VideoDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'analysis';
  
  const videoId = slug ? extractVideoIdFromSlug(slug) : '';
  console.log('[VideoDetail] Processing video ID:', videoId);

  const { data: videoData, isLoading, error } = useVideoDetail(videoId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !videoData) {
    return <ErrorState />;
  }

  const videoDescription = '';  // We can get this from video_summaries table later

  return (
    <>
      <Helmet>
        <title>{`${videoData.title || 'Video'} | ${videoData.educator.name} | SISO Education`}</title>
        <meta name="description" content={videoDescription} />
        <meta property="og:title" content={videoData.title || ''} />
        <meta property="og:description" content={videoDescription} />
        <meta property="og:image" content={videoData.thumbnail_url} />
        <meta property="og:type" content="video.other" />
      </Helmet>

      <div className="min-h-screen bg-black">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <VideoBreadcrumbs title={videoData.title} />
        </div>

        <VideoDetailLayout 
          video={videoData}
          activeTab={activeTab}
        />
      </div>
    </>
  );
}
