
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { EducationHeader } from '@/components/education/layout/EducationHeader';
import { EducationToolbar } from '@/components/education/layout/EducationToolbar';
import { LearningProgress } from '@/components/education/learning/LearningProgress';
import { FeaturedVideosSection } from '@/components/education/FeaturedVideosSection';
import { VideoCategories } from '@/components/education/VideoCategories';
import { useEducationStats } from '@/hooks/use-education-stats';
import { EducationChat } from '@/components/education/chat/EducationChat';
import { LearningContent } from '@/components/education/learning/LearningContent';

export default function SisoEducation() {
  // [Analysis] State management centralized at the top level
  const [activeSection, setActiveSection] = useState<'videos' | 'educators'>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    data: stats,
    isLoading: isStatsLoading
  } = useEducationStats();

  // [Analysis] Early return for loading state could be added here if needed
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <EducationHeader 
            stats={{
              totalEducators: stats?.totalEducators || 0,
              totalVideos: stats?.totalVideos || 0,
              totalStudents: stats?.totalStudents || 0
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearchFocused={isSearchFocused}
            onSearchFocus={() => setIsSearchFocused(true)}
            onSearchBlur={() => setIsSearchFocused(false)}
          />

          {!isSearchFocused && (
            <>
              <FeaturedVideosSection />
              
              <VideoCategories
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
              
              <LearningProgress />
            </>
          )}

          {!isSearchFocused && (
            <EducationToolbar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          )}

          <LearningContent
            activeSection={activeSection}
            searchQuery={searchQuery}
          />

          <EducationChat
            isChatExpanded={isChatExpanded}
            onExpandedChange={setIsChatExpanded}
          />
        </div>
      </div>
    </div>
  );
}
