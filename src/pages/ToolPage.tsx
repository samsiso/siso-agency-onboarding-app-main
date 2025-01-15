import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '@/components/tools/types';
import { Sidebar } from '@/components/Sidebar';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ToolActions } from '@/components/tools/ToolActions';
import { ToolStats } from '@/components/tools/ToolStats';
import { ToolVideos } from '@/components/tools/ToolVideos';
import { ToolTags } from '@/components/tools/ToolTags';

export default function ToolPage() {
  const { slug } = useParams();

  const { data: tool, isLoading, error } = useQuery({
    queryKey: ['tool', slug],
    queryFn: async () => {
      console.log('Fetching tool with slug:', slug);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', slug)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching tool:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Tool not found');
      }

      const transformedData: Tool = {
        ...data,
        youtube_videos: data.youtube_videos ? data.youtube_videos as { title: string; url: string; }[] : null
      };
      
      return transformedData;
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tool?.name,
        text: tool?.description || `Check out ${tool?.name}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out ${tool?.name}${tool?.description ? `: ${tool.description}` : ''}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.includes('watch?v=') 
      ? url.split('watch?v=')[1].split('&')[0]
      : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-siso-text/10 rounded" />
              <div className="h-32 w-full bg-siso-text/10 rounded" />
              <div className="h-8 w-full bg-siso-text/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <Link 
              to="/tools" 
              className="inline-flex items-center gap-2 text-siso-text hover:text-siso-text-bold transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
            <div className="text-red-500">Tool not found. Please try again later.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-siso-text hover:text-siso-text-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <ToolHeader tool={tool} />
              
              {tool.description && (
                <div className="space-y-4 glow-card">
                  <h2 className="text-2xl font-semibold text-siso-text-bold">About {tool.name}</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-siso-text whitespace-pre-line">
                      {tool.description}
                    </p>
                  </div>
                </div>
              )}

              <ToolVideos 
                tool={tool}
                getYoutubeEmbedUrl={getYoutubeEmbedUrl}
              />

              <ToolTags tool={tool} />
            </div>

            {/* Right Column - Actions & Stats */}
            <div className="space-y-8">
              <div className="sticky top-8">
                <div className="space-y-8 glow-card">
                  <ToolActions 
                    tool={tool}
                    onShare={handleShare}
                    onTwitterShare={handleTwitterShare}
                  />

                  <ToolStats tool={tool} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}