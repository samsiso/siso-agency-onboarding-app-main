
import { Link, useParams } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  GitBranch, 
  Users, 
  BarChart, 
  PuzzleIcon, 
  Layout, 
  Code, 
  Palette 
} from 'lucide-react';
import { Pill } from '@/components/ui/pill';

export function ProjectCardNavigation({ projectId }: { projectId: string }) {
  const { tab } = useParams<{ tab: string }>();

  const tabs = [
    { id: 'overview', icon: FileText, label: 'Overview' },
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'active-tasks', icon: GitBranch, label: 'Tasks' },
    { id: 'features', icon: PuzzleIcon, label: 'Features' },
    { id: 'financial', icon: BarChart, label: 'Financial' },
    { id: 'research', icon: Users, label: 'Research' },
    { id: 'app-plan', icon: Layout, label: 'App Plan' },
    { id: 'apis', icon: Code, label: 'APIs' },
    { id: 'wireframe', icon: Layout, label: 'Wireframe' },
    { id: 'colors', icon: Palette, label: 'Colors' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {tabs.map((item) => {
        const Icon = item.icon;
        const isActive = tab === item.id;
        
        return (
          <Link
            key={item.id}
            to={`/projects/${projectId}/${item.id}`}
          >
            <Pill
              variant={isActive ? 'default' : 'secondary'}
              className={isActive 
                ? "bg-black/20 text-white hover:bg-black/30 border border-black/20" 
                : "hover:bg-black/10 text-gray-400 border border-transparent"
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Pill>
          </Link>
        );
      })}
    </div>
  );
}
