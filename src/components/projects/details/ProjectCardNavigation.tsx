
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Calendar, GitBranch, Users } from 'lucide-react';
import { Pill } from '@/components/ui/pill';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'tasks', label: 'Tasks & Features', icon: GitBranch },
  { id: 'team', label: 'Team & Resources', icon: Users },
] as const;

interface ProjectCardNavigationProps {
  projectId: string;
}

export function ProjectCardNavigation({ projectId }: ProjectCardNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {navigationItems.map(({ id, label, icon: Icon }) => {
        const isActive = currentPath === id || (!currentPath && id === 'overview');
        
        return (
          <Pill
            key={id}
            variant={isActive ? 'purple' : 'secondary'}
            className={`cursor-pointer transition-all duration-300 hover:bg-[#9b87f5]/20
              ${isActive ? 'bg-[#9b87f5]/20 hover:bg-[#9b87f5]/30' : 'bg-black/30'}`}
            onClick={() => navigate(`/projects/${projectId}/${id}`)}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Pill>
        );
      })}
    </div>
  );
}
