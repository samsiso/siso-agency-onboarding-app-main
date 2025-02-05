import { AnimatePresence } from 'framer-motion';
import { VideoLibrary } from '../VideoLibrary';
import { EducatorsDirectory } from '../EducatorsDirectory';
import { CommunityMember } from '@/components/community/types';

interface EducationContentProps {
  activeSection: 'videos' | 'educators';
  viewMode: 'grid' | 'list';
  searchQuery: string;
  members?: CommunityMember[];
  isLoading: boolean;
}

export const EducationContent = ({
  activeSection,
  viewMode,
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
          viewMode={viewMode}
          searchQuery={searchQuery}
        />
      ) : (
        <EducatorsDirectory
          key="educators-directory"
          members={members}
          isLoading={isLoading}
          viewMode={viewMode}
          searchQuery={searchQuery}
        />
      )}
    </AnimatePresence>
  );
};