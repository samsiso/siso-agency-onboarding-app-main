import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExternalLink, Users, X, Youtube, Crown, Lock } from "lucide-react";
import { CommunityMember } from "./types";

interface CommunityMemberDetailsProps {
  member: CommunityMember | null;
  onClose: () => void;
}

export const CommunityMemberDetails = ({ member, onClose }: CommunityMemberDetailsProps) => {
  if (!member) return null;

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.includes('watch?v=') 
      ? url.split('watch?v=')[1].split('&')[0]
      : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <Sheet open={!!member} onOpenChange={onClose}>
      <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {member.profile_image_url ? (
                <img 
                  src={member.profile_image_url} 
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-siso-orange/20"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-siso-orange" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                    {member.name}
                  </SheetTitle>
                  {member.member_type === "Personal Development" && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-siso-text/80">
                  {member.member_type && (
                    <span className="capitalize">{member.member_type}</span>
                  )}
                  <Lock className="w-4 h-4" />
                  <span>Private group</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Community Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-siso-text/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-siso-text-bold">
                {formatMemberCount(member.member_count || 0)}
              </div>
              <div className="text-sm text-siso-text/80">Members</div>
            </div>
            <div className="bg-siso-text/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-siso-text-bold">237</div>
              <div className="text-sm text-siso-text/80">Online</div>
            </div>
            <div className="bg-siso-text/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-siso-text-bold">12</div>
              <div className="text-sm text-siso-text/80">Admins</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-siso-text-bold">About</h3>
            <div className="text-siso-text space-y-4 whitespace-pre-line">
              {member.description}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-siso-text-bold flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-siso-orange" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {member.join_url && (
                <Button
                  className="w-full justify-start gap-2 bg-gradient-to-r from-siso-red/90 to-siso-orange/90 hover:from-siso-red hover:to-siso-orange transition-all duration-300"
                  onClick={() => window.open(member.join_url!, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Join Community
                </Button>
              )}
              {member.youtube_url && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-siso-text/20 hover:bg-siso-text/5"
                  onClick={() => window.open(member.youtube_url!, '_blank')}
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  Visit YouTube Channel
                </Button>
              )}
            </div>
          </div>

          {/* Featured Video */}
          {member.youtube_url && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-siso-text-bold flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-500" />
                Featured Video
              </h3>
              <div className="rounded-lg overflow-hidden bg-black/20 ring-1 ring-siso-text/10">
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={getYoutubeEmbedUrl(member.youtube_url)}
                    title={`${member.name} featured video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </AspectRatio>
              </div>
            </div>
          )}

          {/* Additional Videos */}
          {member.youtube_videos && member.youtube_videos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-siso-text-bold">Additional Content</h3>
              <div className="grid gap-4">
                {member.youtube_videos.map((video, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-sm font-medium text-siso-text-bold">{video.title}</h4>
                    <div className="rounded-lg overflow-hidden bg-black/20 ring-1 ring-siso-text/10">
                      <AspectRatio ratio={16 / 9}>
                        <iframe
                          src={getYoutubeEmbedUrl(video.url)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Info */}
          <div className="pt-4 border-t border-siso-text/10 text-sm text-siso-text/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Platform:</span>
              <span className="text-siso-text">{member.platform}</span>
            </div>
            <span>Powered by Skool</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};