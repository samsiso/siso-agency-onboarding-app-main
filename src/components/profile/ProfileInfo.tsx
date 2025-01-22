import { Shield, Trophy, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileInfoProps {
  email: string | null;
  fullName: string | null;
  points: number;
  rank: string;
}

export const ProfileInfo = ({ email, fullName, points, rank }: ProfileInfoProps) => {
  return (
    <Card className="bg-black/20 border-siso-text/10">
      <CardHeader>
        <CardTitle className="text-siso-text-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-siso-red" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-siso-text/70">Email</p>
          <p className="text-siso-text">{email}</p>
        </div>
        <div>
          <p className="text-sm text-siso-text/70">Full Name</p>
          <p className="text-siso-text">{fullName || 'Not set'}</p>
        </div>
        <div>
          <p className="text-sm text-siso-text/70">Points</p>
          <p className="text-siso-text flex items-center gap-2">
            <Trophy className="w-4 h-4 text-siso-orange" />
            {points || 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-siso-text/70">Rank</p>
          <p className="text-siso-text flex items-center gap-2">
            <Star className="w-4 h-4 text-siso-orange" />
            {rank || 'Newbie'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};