import { HeaderTitle } from './header/HeaderTitle';
import { StatsDisplay } from './header/StatsDisplay';
import { SearchSection } from './header/SearchSection';

interface EducationHeaderProps {
  stats: {
    totalEducators: number;
    totalVideos: number;
    totalStudents: number;
  };
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const EducationHeader = ({ 
  stats, 
  searchQuery, 
  onSearchChange 
}: EducationHeaderProps) => {
  return (
    <div className="space-y-6 px-6 py-8">
      <HeaderTitle />
      <StatsDisplay stats={stats} />
      <SearchSection 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
  );
};