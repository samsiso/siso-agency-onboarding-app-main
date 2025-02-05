import { Button } from '@/components/ui/button';
import { Grid2X2, List, Video, Users } from 'lucide-react';

interface EducationToolbarProps {
  activeSection: 'videos' | 'educators';
  viewMode: 'grid' | 'list';
  onSectionChange: (section: 'videos' | 'educators') => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const EducationToolbar = ({
  activeSection,
  viewMode,
  onSectionChange,
  onViewModeChange,
}: EducationToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      {/* Section Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeSection === 'videos' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('videos')}
          className="gap-2"
        >
          <Video className="w-4 h-4" />
          Videos
        </Button>
        <Button
          variant={activeSection === 'educators' ? 'default' : 'ghost'}
          onClick={() => onSectionChange('educators')}
          className="gap-2"
        >
          <Users className="w-4 h-4" />
          Educators
        </Button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid2X2 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="icon"
          onClick={() => onViewModeChange('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};