import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ExternalLink, Heart, Star, Download, Youtube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '@/components/tools/types';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Sidebar } from '@/components/Sidebar';

export default function ToolPage() {
  const { id } = useParams();

  const { data: tool, isLoading, error } = useQuery({
    queryKey: ['tool', id],
    queryFn: async () => {
      console.log('Fetching tool with id:', id);
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching tool:', error);
        throw error;
      }
      
      return data as Tool;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-48 bg-siso-text/10 rounded mb-4" />
              <div className="h-4 w-full bg-siso-text/10 rounded mb-2" />
              <div className="h-4 w-3/4 bg-siso-text/10 rounded" />
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
          <div className="max-w-4xl mx-auto">
            <div className="text-red-500">Error loading tool. Please try again later.</div>
          </div>
        </div>
      </div>
    );
  }

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.includes('watch?v=') 
      ? url.split('watch?v=')[1].split('&')[0]
      : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/tools" 
            className="inline-flex items-center gap-2 text-siso-text hover:text-siso-text-bold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              {tool.profile_image_url ? (
                <img 
                  src={tool.profile_image_url} 
                  alt={tool.name}
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-siso-orange/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center ring-2 ring-siso-orange/20">
                  <Star className="w-12 h-12 text-siso-orange" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text mb-2">
                  {tool.name}
                </h1>
                <p className="text-lg text-siso-text/80">
                  {tool.member_type || tool.category}
                </p>
              </div>
            </div>

            {tool.description && (
              <div className="prose prose-invert max-w-none">
                <p className="text-siso-text text-lg leading-relaxed">
                  {tool.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tool.website_url && (
                <Button
                  className="w-full justify-center gap-2 bg-gradient-to-r from-siso-red/90 to-siso-orange/90 hover:from-siso-red hover:to-siso-orange transition-all duration-300"
                  onClick={() => window.open(tool.website_url!, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </Button>
              )}
              {tool.youtube_url && (
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2 border-siso-text/20 hover:bg-siso-text/5"
                  onClick={() => window.open(tool.youtube_url!, '_blank')}
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  Watch on YouTube
                </Button>
              )}
            </div>

            {!tool.member_type && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-6 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-colors">
                  <Star className="h-6 w-6 text-siso-orange mx-auto mb-2" />
                  <div className="text-lg font-medium text-siso-text-bold">{tool.rating?.toFixed(1) || '-'}</div>
                  <div className="text-sm text-siso-text">Rating</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-colors">
                  <Download className="h-6 w-6 text-siso-text/60 mx-auto mb-2" />
                  <div className="text-lg font-medium text-siso-text-bold">{tool.downloads_count || '0'}</div>
                  <div className="text-sm text-siso-text">Downloads</div>
                </div>
                <div className="text-center p-6 rounded-lg bg-siso-text/5 hover:bg-siso-text/10 transition-colors">
                  <Heart className="h-6 w-6 text-siso-red mx-auto mb-2" />
                  <div className="text-lg font-medium text-siso-text-bold">{tool.likes_count || '0'}</div>
                  <div className="text-sm text-siso-text">Likes</div>
                </div>
              </div>
            )}

            {tool.youtube_url && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-siso-text-bold">Demo Video</h2>
                <div className="rounded-lg overflow-hidden bg-black/20 ring-1 ring-siso-text/10">
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      src={getYoutubeEmbedUrl(tool.youtube_url)}
                      title={`${tool.name} demo video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </AspectRatio>
                </div>
              </div>
            )}

            {tool.specialization && tool.specialization.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-siso-text-bold">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.specialization.map((spec, index) => (
                    <span 
                      key={index}
                      className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text hover:bg-siso-text/20 transition-colors cursor-default"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tool.content_themes && tool.content_themes.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-siso-text-bold">Content Themes</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.content_themes.map((theme, index) => (
                    <span 
                      key={index}
                      className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange hover:bg-siso-orange/20 transition-colors cursor-default"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}