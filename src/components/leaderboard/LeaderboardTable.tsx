import { Trophy, Users, UserPlus, Clock, Award, Medal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from './types';

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
}

export const LeaderboardTable = ({ leaderboardData }: LeaderboardTableProps) => {
  const getDisplayName = (entry: LeaderboardEntry) => {
    if (entry.profile?.full_name) return entry.profile.full_name;
    if (entry.profile?.email) {
      const emailParts = entry.profile.email.split('@');
      return emailParts[0];
    }
    return 'Anonymous User';
  };

  const formatLastActive = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 0:
        return <Award className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRowClassName = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/10 to-transparent hover:from-yellow-500/20";
    if (index === 1) return "bg-gradient-to-r from-gray-500/10 to-transparent hover:from-gray-500/20";
    if (index === 2) return "bg-gradient-to-r from-amber-500/10 to-transparent hover:from-amber-500/20";
    if (index < 10) return "bg-gradient-to-r from-siso-bg-alt/50 to-transparent hover:from-siso-bg-alt/70";
    return "hover:bg-siso-bg-alt/30";
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-siso-bg z-10">
          <TableRow className="border-b border-siso-border">
            <TableHead className="w-[80px] text-center">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Points</TableHead>
            <TableHead className="text-center">Contributions</TableHead>
            <TableHead className="text-center">Referrals</TableHead>
            <TableHead className="text-center">SISO Tokens</TableHead>
            <TableHead className="text-center">Last Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry, index) => (
            <TableRow 
              key={entry.id}
              className={cn(
                "transition-all duration-200",
                getRowClassName(index)
              )}
            >
              <TableCell className="text-center font-medium">
                <div className="flex items-center justify-center gap-2">
                  {getRankBadge(index)}
                  <span className={cn(
                    "font-bold",
                    index < 3 ? "text-siso-text-bold" : "text-siso-text"
                  )}>
                    {index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-siso-text-bold">
                {getDisplayName(entry)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{entry.points || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-siso-text/70" />
                  <span>{entry.contribution_count || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4 text-siso-text/70" />
                  <span>{entry.referral_count || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">
                {entry.siso_tokens || 0}
              </TableCell>
              <TableCell className="text-center text-siso-text/70">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatLastActive(entry.updated_at)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};