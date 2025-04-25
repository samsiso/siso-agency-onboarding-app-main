
import { Link, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Calendar, 
  GitBranch, 
  Users, 
  BarChart, 
  PuzzleIcon, 
  Layout, 
  Api, 
  Palette 
} from 'lucide-react';

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
    { id: 'apis', icon: Api, label: 'APIs' },
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
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              isActive 
                ? "bg-[#9b87f5]/20 text-[#9b87f5] font-medium border border-[#9b87f5]/20" 
                : "hover:bg-black/30 text-gray-400 border border-transparent"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
