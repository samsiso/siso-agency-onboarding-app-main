import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LeaderboardEntry } from '@/components/leaderboard/types';
import { motion } from 'framer-motion';

interface PortfolioLeaderboardTableProps {
  projectData: (LeaderboardEntry & {
    project_name: string;
    live_url: string;
    technologies: string[];
    development_status: string;
    completion_percentage: number;
    estimated_value: number;
  })[];
  onProjectClick: (entry: any) => void;
}

export const PortfolioLeaderboardTable = ({ projectData, onProjectClick }: PortfolioLeaderboardTableProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 text-xs bg-siso-orange/20 text-siso-orange rounded-full border border-siso-orange/30">Live</span>;
      default:
        return <span className="px-3 py-1 text-xs bg-gray-800 text-gray-400 rounded-full border border-gray-700">In Progress</span>;
    }
  };

  const getRankBadge = (position: number) => {
    if (position < 3) {
      return <div className="w-8 h-8 bg-siso-orange rounded-full flex items-center justify-center text-black text-sm font-bold">{position + 1}</div>;
    }
    return <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm font-medium">{position + 1}</div>;
  };

  const handleProjectClick = (entry: any) => {
    if (entry.live_url) {
      window.open(entry.live_url, '_blank', 'noopener,noreferrer');
    }
    onProjectClick(entry);
  };

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-800">
            <TableHead className="w-[80px] text-center text-gray-400 font-medium">#</TableHead>
            <TableHead className="text-gray-400 font-medium">Project</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Client</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Status</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Value</TableHead>
            <TableHead className="text-center text-gray-400 font-medium">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectData.map((entry, index) => {
            return (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-900 hover:bg-gray-900/50 cursor-pointer transition-colors duration-200"
                onClick={() => handleProjectClick(entry)}
              >
                <TableCell className="text-center">
                  {getRankBadge(index)}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-siso-orange to-siso-red flex items-center justify-center text-white font-bold text-sm">
                      {entry.project_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{entry.project_name}</p>
                      <p className="text-sm text-gray-500 max-w-[200px] truncate">{entry.profile?.bio}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="text-gray-300">{entry.profile?.full_name}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  {getStatusBadge(entry.development_status)}
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="text-white font-medium">${entry.estimated_value.toLocaleString()}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(entry.live_url, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-4 py-2 bg-siso-orange hover:bg-siso-orange/90 text-black text-sm font-medium rounded-lg transition-colors"
                  >
                    View Live
                  </button>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}; 