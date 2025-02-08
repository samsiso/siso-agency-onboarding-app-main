
import { AnimatePresence } from 'framer-motion';
import { VideoLibrary } from '../VideoLibrary';
import { EducatorsDirectory } from '../EducatorsDirectory';
import { CommunityMember } from '@/components/community/types';

interface EducationContentProps {
  activeSection: 'videos' | 'educators';
  searchQuery: string;
  members?: CommunityMember[];
  isLoading: boolean;
}

export const EducationContent = ({
  activeSection,
  searchQuery,
  members,
  isLoading
}: EducationContentProps) => {
  return (
    <AnimatePresence mode="wait">
      {activeSection === 'videos' ? (
        <VideoLibrary
          key="video-library"
          isLoading={isLoading}
          selectedEducator={null}
          searchQuery={searchQuery}
        />
      ) : (
        <EducatorsDirectory
          key="educators-directory"
          members={members}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      )}
    </AnimatePresence>
  );
};

