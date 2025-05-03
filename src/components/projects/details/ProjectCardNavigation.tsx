
import { Link, useParams } from 'react-router-dom';
import { 
  FileText, 
  Layout, 
  PuzzleIcon, 
  GitBranch, 
  Calendar,
  BarChart,
  Users,
  File,
  Workflow,
  Search,
  Framer,
  MessageSquare
} from 'lucide-react';
import { Pill } from '@/components/ui/pill';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ProjectCardNavigation({ projectId }: { projectId: string }) {
  const { tab } = useParams<{ tab: string }>();

  const tabs = [
    { id: 'overview', icon: FileText, label: 'Overview' },
    { id: 'agency-steps', icon: Workflow, label: 'Agency Steps' },
    { id: 'market-research', icon: Search, label: 'Market Research' },
    { id: 'features', icon: PuzzleIcon, label: 'Features' },
    { id: 'wireframe', icon: Framer, label: 'Wireframe' },
    { id: 'user-flow', icon: Layout, label: 'User Flow' },
    { id: 'feedback-log', icon: MessageSquare, label: 'Feedback Log' },
    { id: 'active-tasks', icon: GitBranch, label: 'Tasks' },
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'financial', icon: BarChart, label: 'Financial' },
    { id: 'documents', icon: File, label: 'Documents' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 mb-8 stagger-children"
    >
      {tabs.map((item, index) => {
        const Icon = item.icon;
        const isActive = tab === item.id;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link
              to={`/projects/${projectId}/${item.id}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Pill
                variant={isActive ? 'default' : 'secondary'}
                className={cn(
                  isActive 
                    ? "border border-[#ea384c]/20 bg-[#ea384c]/20 text-[#ea384c]" 
                    : "border border-transparent hover:border-[#ea384c]/10 hover:bg-[#ea384c]/10 hover:text-[#ea384c]",
                  "transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Pill>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
