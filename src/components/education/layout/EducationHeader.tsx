import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface EducationHeaderProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const EducationHeader = ({ stats, searchQuery, onSearchChange }: EducationHeaderProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg border border-siso-border"
        >
          <h3 className="text-sm text-siso-text/70">Total Educators</h3>
          <p className="text-2xl font-bold text-siso-text-bold">{stats.totalEducators}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg border border-siso-border"
        >
          <h3 className="text-sm text-siso-text/70">Total Videos</h3>
          <p className="text-2xl font-bold text-siso-text-bold">{stats.totalVideos}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg border border-siso-border"
        >
          <h3 className="text-sm text-siso-text/70">Total Students</h3>
          <p className="text-2xl font-bold text-siso-text-bold">{stats.totalStudents}</p>
        </motion.div>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/50" />
        <Input
          type="text"
          placeholder="Search educators and videos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-siso-bg-alt border-siso-border"
        />
      </div>
    </div>
  );
};