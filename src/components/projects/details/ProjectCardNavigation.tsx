
import { Link, useParams } from 'react-router-dom';
import { 
  FileText, 
  Layout, 
  PuzzleIcon, 
  GitBranch, 
  Calendar,
  Palette,
  Code,
  BarChart,
  Users
} from 'lucide-react';
import { Pill } from '@/components/ui/pill';

export function ProjectCardNavigation({ projectId }: { projectId: string }) {
  const { tab } = useParams<{ tab: string }>();

  const tabs = [
    { id: 'overview', icon: FileText, label: 'Overview' },
    { id: 'app-plan', icon: Layout, label: 'App Plan' },
    { id: 'features', icon: PuzzleIcon, label: 'Features' },
    { id: 'active-tasks', icon: GitBranch, label: 'Tasks' },
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'wireframe', icon: Layout, label: 'Wireframe' },
    { id: 'colors', icon: Palette, label: 'Colors' },
    { id: 'apis', icon: Code, label: 'APIs' },
    { id: 'financial', icon: BarChart, label: 'Financial' },
    { id: 'research', icon: Users, label: 'Research' }
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
                ? "border border-black/20" 
                : "border border-transparent"
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
