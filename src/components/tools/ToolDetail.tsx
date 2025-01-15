import { Button } from "@/components/ui/button";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Download, ExternalLink, Heart, Star, Youtube } from 'lucide-react';
import { Tool } from './types';

interface ToolDetailProps {
  tool: Tool;
  onClose: () => void;
}

export function ToolDetail({ tool, onClose }: ToolDetailProps) {
  return (
    <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl overflow-y-auto">
      <SheetHeader className="space-y-4">
        <div className="flex items-center gap-3">
          {tool.member_type && tool.profile_image_url ? (
            <img 
              src={tool.profile_image_url} 
              alt={tool.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
              <Star className="w-8 h-8 text-siso-orange" />
            </div>
          )}
          <div>
            <SheetTitle className="text-2xl font-bold text-siso-text-bold">
              {tool.name}
            </SheetTitle>
            {tool.member_type ? (
              <p className="text-sm text-siso-text/80 capitalize">{tool.member_type}</p>
            ) : (
              <p className="text-sm text-siso-text/80">{tool.category}</p>
            )}
          </div>
        </div>
        <SheetDescription className="text-siso-text">
          {tool.description}
        </SheetDescription>
      </SheetHeader>

      <div className="mt-6 space-y-6">
        {tool.youtube_url && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-siso-text-bold">Featured Video</h3>
            <div className="rounded-lg overflow-hidden bg-black/20">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src={tool.youtube_url.replace('watch?v=', 'embed/')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {tool.website_url && (
              <Button
                className="w-full justify-start gap-2"
                onClick={() => window.open(tool.website_url!, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </Button>
            )}
            {tool.youtube_url && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => window.open(tool.youtube_url!, '_blank')}
              >
                <Youtube className="h-4 w-4 text-red-500" />
                YouTube Channel
              </Button>
            )}
          </div>
        </div>

        {tool.specialization && tool.specialization.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-siso-text-bold">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {tool.specialization.map((spec, index) => (
                <span 
                  key={index}
                  className="text-sm px-3 py-1 rounded-full bg-siso-text/10 text-siso-text"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {tool.content_themes && tool.content_themes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-siso-text-bold">Content Themes</h3>
            <div className="flex flex-wrap gap-2">
              {tool.content_themes.map((theme, index) => (
                <span 
                  key={index}
                  className="text-sm px-3 py-1 rounded-full bg-siso-orange/10 text-siso-orange"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {!tool.member_type && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-siso-text-bold">Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-siso-text/5">
                <Star className="h-5 w-5 text-siso-orange mx-auto mb-1" />
                <div className="text-sm text-siso-text-bold">{tool.rating?.toFixed(1) || '-'}</div>
                <div className="text-xs text-siso-text">Rating</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-siso-text/5">
                <Download className="h-5 w-5 text-siso-text/60 mx-auto mb-1" />
                <div className="text-sm text-siso-text-bold">{tool.downloads_count || '0'}</div>
                <div className="text-xs text-siso-text">Downloads</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-siso-text/5">
                <Heart className="h-5 w-5 text-siso-red mx-auto mb-1" />
                <div className="text-sm text-siso-text-bold">{tool.likes_count || '0'}</div>
                <div className="text-xs text-siso-text">Likes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SheetContent>
  );
}