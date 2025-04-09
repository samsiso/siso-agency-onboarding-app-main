
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Award, ExternalLink } from "lucide-react";
import type { LeaderboardEntry } from "./types";

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  
  const getTrophyColor = (index: number) => {
    switch (index) {
      case 0: return "text-yellow-500";
      case 1: return "text-gray-400";
      case 2: return "text-amber-600";
      default: return "text-siso-text/50";
    }
  };
  
  return (
    <div className="rounded-md border border-siso-text/10 overflow-hidden">
      <div className="relative overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow>
              <TableHead className="w-12 text-siso-text-bold">Rank</TableHead>
              <TableHead className="text-siso-text-bold">User</TableHead>
              <TableHead className="text-siso-text-bold text-right">Points</TableHead>
              <TableHead className="text-siso-text-bold text-right hidden md:table-cell">SISO Tokens</TableHead>
              <TableHead className="text-siso-text-bold hidden lg:table-cell">Achievements</TableHead>
              <TableHead className="text-siso-text-bold text-right hidden lg:table-cell">Contributions</TableHead>
              <TableHead className="text-siso-text-bold text-right hidden md:table-cell">Referrals</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-siso-text/70">
                  No leaderboard data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((entry, index) => (
                <TableRow key={entry.id} className="hover:bg-black/40 transition-colors">
                  <TableCell className="font-medium flex items-center">
                    {index < 3 ? (
                      <Trophy className={`h-5 w-5 ${getTrophyColor(index)}`} />
                    ) : (
                      <span className="text-sm text-siso-text/70">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-siso-text/10">
                        <AvatarImage src={entry.profile.avatar_url || undefined} alt={entry.profile.full_name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-siso-red/30 to-siso-orange/30 text-siso-text-bold">
                          {getInitials(entry.profile.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-siso-text-bold flex items-center gap-1">
                          {entry.profile.full_name || "Anonymous User"}
                          {entry.profile.linkedin_url && (
                            <a href={entry.profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-siso-text/50 hover:text-siso-text">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-siso-text/70">
                          {entry.profile.professional_role || "Community Member"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-siso-text-bold">
                    {entry.points.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {entry.siso_tokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-1">
                      {entry.achievements && entry.achievements.length > 0 ? (
                        entry.achievements.slice(0, 3).map((achievement, i) => (
                          <Badge key={i} variant="outline" className="bg-siso-orange/10 text-siso-orange border-siso-orange/20">
                            <Award className="h-3 w-3 mr-1" />
                            {achievement.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-siso-text/50">No achievements yet</span>
                      )}
                      {entry.achievements && entry.achievements.length > 3 && (
                        <Badge variant="outline" className="bg-black/30 text-siso-text/70 border-siso-text/20">
                          +{entry.achievements.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">
                    {entry.contribution_count}
                  </TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {entry.referral_count}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
