
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Calendar, ListTodo, Wallet, GitBranch, LayoutDashboard, Palette, FileSearch, FileCheck, Terminal } from 'lucide-react';
import { Pill } from '@/components/ui/pill';

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'active-tasks', label: 'Active Tasks', icon: ListTodo },
  { id: 'financial', label: 'Financial', icon: Wallet },
  { id: 'features', label: 'Features', icon: GitBranch },
  { id: 'research', label: 'Research', icon: FileSearch },
  { id: 'app-plan', label: 'App Plan', icon: FileCheck },
  { id: 'apis', label: 'APIs', icon: Terminal },
  { id: 'wireframe', label: 'Wireframe', icon: LayoutDashboard },
  { id: 'colors', label: 'Colors', icon: Palette }
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
