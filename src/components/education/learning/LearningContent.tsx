
import { useState } from 'react';
import { VideoLibrary } from '../VideoLibrary';
import { EducatorsDirectory } from '../EducatorsDirectory';
import { AnimatePresence } from 'framer-motion';
import { useEducatorsList } from '@/hooks/education';

interface LearningContentProps {
  activeSection: 'videos' | 'educators';
  searchQuery: string;
}

export const LearningContent = ({ activeSection, searchQuery }: LearningContentProps) => {
  const { 
    data: educatorData,
    isLoading: isEducatorsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useEducatorsList(searchQuery);

  const members = educatorData?.pages.flatMap(page => page.educators) || [];

  return (
    <AnimatePresence mode="wait">
      {activeSection === 'videos' ? (
        <VideoLibrary
          key="video-library"
          isLoading={false}
          selectedEducator={null}
          searchQuery={searchQuery}
        />
      ) : (
        <EducatorsDirectory
          key="educators-directory"
          members={members}
          isLoading={isEducatorsLoading}
          searchQuery={searchQuery}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </AnimatePresence>
  );
};
