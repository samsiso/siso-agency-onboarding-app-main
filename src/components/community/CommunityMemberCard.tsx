import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { CommunityMember } from "./types";

interface CommunityMemberCardProps {
  member: CommunityMember;
  onClick: (member: CommunityMember) => void;
}

export const CommunityMemberCard = ({ member, onClick }: CommunityMemberCardProps) => {
  return (
    <Card 
      className="group bg-gradient-to-br from-siso-red/10 to-siso-orange/10 border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer p-2"
      onClick={() => onClick(member)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {member.profile_image_url ? (
            <img 
              src={member.profile_image_url} 
              alt={member.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-siso-orange" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-siso-text-bold truncate">{member.name}</h3>
            <p className="text-sm text-siso-text/80 capitalize">{member.member_type}</p>
          </div>
        </div>
        {member.description && (
          <p className="mt-3 text-sm text-siso-text line-clamp-2">
            {member.description}
          </p>
        )}
        {member.specialization && (
          <div className="flex flex-wrap gap-2 mt-3">
            {member.specialization.slice(0, 2).map((spec, index) => (
              <span 
                key={index}
                className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 text-siso-text-bold"
              >
                {spec}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};