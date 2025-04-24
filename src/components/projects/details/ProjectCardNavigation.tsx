
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Calendar, GitBranch, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { GlowEffect } from '@/components/ui/glow-effect';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: GitBranch },
  { id: 'team', label: 'Team', icon: Users },
] as const;

interface ProjectCardNavigationProps {
  projectId: string;
}

export function ProjectCardNavigation({ projectId }: ProjectCardNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {navigationItems.map(({ id, label, icon: Icon }) => {
        const isActive = currentPath === id || (!currentPath && id === 'overview');
        
        return (
          <Card
            key={id}
            className={`relative p-6 cursor-pointer transition-all duration-300 overflow-hidden bg-black/30 border-siso-text/10 
              ${isActive ? 'ring-2 ring-[#9b87f5]' : 'hover:border-[#9b87f5]/50'}`}
            onClick={() => navigate(`/projects/${projectId}/${id}`)}
          >
            {isActive && (
              <GlowEffect
                colors={['#9b87f5', '#6E59A5']}
                mode="colorShift"
                className="opacity-10"
              />
            )}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <Icon className={`w-6 h-6 ${isActive ? 'text-[#9b87f5]' : 'text-siso-text'}`} />
              <span className={isActive ? 'text-white font-medium' : 'text-siso-text'}>{label}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
