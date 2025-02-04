import { motion, AnimatePresence } from 'framer-motion';
import { CommunityMember } from '../../community/types';
import { CommunityMemberCard } from '../../community/CommunityMemberCard';

interface DirectoryListProps {
  members: CommunityMember[];
  viewMode: 'grid' | 'list';
  onMemberSelect: (member: CommunityMember) => void;
}

export const DirectoryList = ({ members, viewMode, onMemberSelect }: DirectoryListProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
      className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "flex flex-col gap-4"
      }
    >
      {members.map((member) => (
        <motion.div
          key={member.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className={viewMode === 'list' ? 'w-full' : ''}
        >
          <CommunityMemberCard
            member={member}
            onClick={() => onMemberSelect(member)}
            viewMode={viewMode}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};