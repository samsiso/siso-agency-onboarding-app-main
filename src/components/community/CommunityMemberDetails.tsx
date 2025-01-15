import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ExternalLink, Users, X, Youtube } from "lucide-react";
import { CommunityMember } from "./types";

interface CommunityMemberDetailsProps {
  member: CommunityMember | null;
  onClose: () => void;
}

export const CommunityMemberDetails = ({ member, onClose }: CommunityMemberDetailsProps) => {
  if (!member) return null;

  return (
    <Sheet open={!!member} onOpenChange={onClose}>
      <SheetContent className="bg-siso-bg border-l border-siso-text/10 w-full sm:max-w-xl">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {member.profile_image_url && (
                <img 
                  src={member.profile_image_url} 
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <SheetTitle className="text-2xl font-bold text-siso-text-bold">
                  {member.name}
                </SheetTitle>
                <p className="text-sm text-siso-text/80 capitalize">{member.member_type}</p>
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
          <SheetDescription className="text-siso-text">
            {member.description}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-siso-text-bold">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {member.website_url && (
                <Button
                  className="w-full justify-start gap-2"
                  onClick={() => window.open(member.website_url!, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </Button>
              )}
              {member.youtube_url && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open(member.youtube_url!, '_blank')}
                >
                  <Youtube className="h-4 w-4 text-red-500" />
                  Visit YouTube Channel
                </Button>
              )}
            </div>
          </div>

          {member.specialization && member.specialization.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {member.specialization.map((spec, index) => (
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

          {member.content_themes && member.content_themes.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-siso-text-bold">Content Themes</h3>
              <div className="flex flex-wrap gap-2">
                {member.content_themes.map((theme, index) => (
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
        </div>
      </SheetContent>
    </Sheet>
  );
};