import { motion, AnimatePresence } from 'framer-motion';
import { CommunityMember } from '../community/types';
import { CommunityMemberCard } from '../community/CommunityMemberCard';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import { useState } from 'react';

interface EducatorsDirectoryProps {
  members?: CommunityMember[];
  isLoading: boolean;
}

export const EducatorsDirectory = ({ members, isLoading }: EducatorsDirectoryProps) => {
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key="educators-grid"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
              </div>
            ))
          ) : members?.map((member) => (
            <motion.div
              key={member.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <CommunityMemberCard
                member={member}
                onClick={setSelectedMember}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <CommunityMemberDetails
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </motion.div>
  );
};