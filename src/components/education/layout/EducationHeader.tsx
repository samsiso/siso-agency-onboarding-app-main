
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
    <div className="relative">
      {/* [Analysis] Orange container with gradient background for visual impact */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-siso-orange/90 to-siso-red/80 shadow-lg">
        {/* [Analysis] Subtle backdrop blur and inner glow effect */}
        <div className="absolute inset-0 backdrop-blur-sm bg-white/5" />
        
        {/* [Analysis] Main content with proper spacing and layout */}
        <div className="relative space-y-8 px-8 py-12">
          <HeaderTitle />
          <StatsDisplay stats={stats} />
          <SearchSection 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
};
