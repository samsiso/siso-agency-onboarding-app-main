import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExternalLink, Users, X, Youtube, Crown, Lock, Globe, Linkedin, Instagram, Twitter } from "lucide-react";
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
              {member.profile?.avatar_url ? (
                <img 
                  src={member.profile.avatar_url} 
                  alt={member.profile?.full_name || 'User'}
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
                    {member.profile?.full_name || member.profile?.email?.split('@')[0] || 'Anonymous User'}
                  </SheetTitle>
                  {member.rank === "Diamond" && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-siso-text/80">
                  <span className="capitalize">{member.rank || 'Newbie'}</span>
                  {member.profile?.professional_role && (
                    <>
                      <span>•</span>
                      <span>{member.profile.professional_role}</span>
                    </>
                  )}
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
          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-siso-text/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-siso-text-bold">
                {member.points || 0}
              </div>
              <div className="text-sm text-siso-text/80">Points</div>
            </div>
            <div className="bg-siso-text/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-siso-text-bold">
                {member.contribution_count || 0}
              </div>
              <div className="text-sm text-siso-text/80">Contributions</div>
            </div>
            <div className="bg-siso-text/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-siso-text-bold">
                {member.referral_count || 0}
              </div>
              <div className="text-sm text-siso-text/80">Referrals</div>
            </div>
          </div>

          {/* Bio */}
          {member.profile?.bio && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-siso-text-bold">About</h3>
              <div className="text-siso-text space-y-4 whitespace-pre-line">
                {member.profile.bio}
              </div>
            </div>
          )}

          {/* Social Links */}
          {(member.profile?.linkedin_url || 
            member.profile?.website_url || 
            member.profile?.youtube_url || 
            member.profile?.instagram_url || 
            member.profile?.twitter_url) && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-siso-text-bold flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-siso-orange" />
                Social Links
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {member.profile?.linkedin_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-siso-text/20 hover:bg-siso-text/5"
                    onClick={() => window.open(member.profile?.linkedin_url!, '_blank')}
                  >
                    <Linkedin className="h-4 w-4 text-blue-500" />
                    LinkedIn Profile
                  </Button>
                )}
                {member.profile?.website_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-siso-text/20 hover:bg-siso-text/5"
                    onClick={() => window.open(member.profile?.website_url!, '_blank')}
                  >
                    <Globe className="h-4 w-4 text-green-500" />
                    Website
                  </Button>
                )}
                {member.profile?.youtube_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-siso-text/20 hover:bg-siso-text/5"
                    onClick={() => window.open(member.profile?.youtube_url!, '_blank')}
                  >
                    <Youtube className="h-4 w-4 text-red-500" />
                    YouTube Channel
                  </Button>
                )}
                {member.profile?.instagram_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-siso-text/20 hover:bg-siso-text/5"
                    onClick={() => window.open(member.profile?.instagram_url!, '_blank')}
                  >
                    <Instagram className="h-4 w-4 text-pink-500" />
                    Instagram
                  </Button>
                )}
                {member.profile?.twitter_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-siso-text/20 hover:bg-siso-text/5"
                    onClick={() => window.open(member.profile?.twitter_url!, '_blank')}
                  >
                    <Twitter className="h-4 w-4 text-blue-400" />
                    Twitter
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Platform Info */}
          <div className="pt-4 border-t border-siso-text/10 text-sm text-siso-text/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Rank:</span>
              <span className="text-siso-text capitalize">{member.rank || 'Newbie'}</span>
            </div>
            <span>SISO Member</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};