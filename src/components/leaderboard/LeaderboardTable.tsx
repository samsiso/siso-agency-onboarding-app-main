
import { Trophy, Users, UserPlus, Clock, Award, Medal, TrendingUp, TrendingDown, CircleDollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { LeaderboardEntry } from './types';
import { motion } from 'framer-motion';

interface LeaderboardTableProps {
  leaderboardData: LeaderboardEntry[];
  onUserClick: (entry: LeaderboardEntry) => void;
}

export const LeaderboardTable = ({ leaderboardData, onUserClick }: LeaderboardTableProps) => {
  const getDisplayName = (entry: LeaderboardEntry) => {
    if (entry.profile?.full_name) return entry.profile.full_name;
    if (entry.profile?.email) {
      const emailParts = entry.profile.email.split('@');
      return emailParts[0];
    }
    return 'Anonymous User';
  };

  const formatLastActive = (date: string | undefined) => {
    if (!date) return 'Unknown';
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
        return (
          <div className="relative">
            <Award className="h-6 w-6 text-yellow-500" />
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-500/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        );
      case 1:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRowClassName = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-transparent hover:from-yellow-500/20";
    if (index === 1) return "bg-gradient-to-r from-gray-500/10 via-gray-500/5 to-transparent hover:from-gray-500/20";
    if (index === 2) return "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent hover:from-amber-500/20";
    if (index < 10) return "bg-gradient-to-r from-siso-bg-alt/50 via-siso-bg-alt/25 to-transparent hover:from-siso-bg-alt/70";
    return "hover:bg-siso-bg-alt/30";
  };

  const getTrendIndicator = (index: number) => {
    // Simulate trend - in real app this would be calculated from historical data
    const isUp = Math.random() > 0.5;
    return (
      <span className={cn(
        "inline-flex items-center text-xs",
        isUp ? "text-green-500" : "text-red-500"
      )}>
        {isUp ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {isUp ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}
      </span>
    );
  };

  return (
    <div className="relative overflow-x-auto rounded-lg border border-siso-border bg-black/20 backdrop-blur-sm">
      <Table>
        <TableHeader className="sticky top-0 bg-siso-bg z-10">
          <TableRow className="border-b border-siso-border">
            <TableHead className="w-[80px] text-center">Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Points</TableHead>
            <TableHead className="text-center">Trend</TableHead>
            <TableHead className="text-center">Contributions</TableHead>
            <TableHead className="text-center">Referrals</TableHead>
            <TableHead className="text-center">SISO Tokens</TableHead>
            <TableHead className="text-center">Last Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((entry, index) => (
            <motion.tr
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "transition-all duration-200 cursor-pointer group",
                getRowClassName(index)
              )}
              onClick={() => onUserClick(entry)}
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
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red to-siso-orange flex items-center justify-center text-white font-bold">
                      {getDisplayName(entry).charAt(0)}
                    </div>
                    {entry.achievements && entry.achievements.length > 0 && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-siso-orange rounded-full flex items-center justify-center text-[10px] text-white">
                        {entry.achievements.length}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-siso-text-bold font-semibold">{getDisplayName(entry)}</p>
                    <p className="text-xs text-siso-text/70">{entry.rank || 'Rookie'}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{entry.points || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getTrendIndicator(index)}
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
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-siso-orange" />
                  <span className="font-medium">{entry.siso_tokens || 0}</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-siso-text/70">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatLastActive(entry.updated_at)}</span>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
