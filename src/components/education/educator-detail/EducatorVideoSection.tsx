import { VideoLibrary } from '@/components/education/VideoLibrary';

interface EducatorVideoSectionProps {
  educatorId: string;
}

export const EducatorVideoSection = ({ educatorId }: EducatorVideoSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-siso-text">Latest Videos</h2>
      <VideoLibrary
        selectedEducator={educatorId}
        viewMode="grid"
        searchQuery=""
        isLoading={false}
      />
    </div>
  );
};