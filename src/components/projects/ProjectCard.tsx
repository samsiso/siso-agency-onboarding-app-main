
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/lib/formatters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, MoreVertical, Trash2 } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface Project {
  id: string;
  app_name: string;
  company_name: string | null;
  username: string;
  estimated_cost: number;
  estimated_days: number;
  features: string[];
  status: string;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };
  
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleView = () => {
    navigate(`/plan/${project.username}`);
  };
  
  const handleEdit = () => {
    // For future implementation
    console.log('Edit project:', project.id);
  };
  
  const handleDelete = () => {
    // For future implementation
    console.log('Delete project:', project.id);
  };
  
  return (
    <Card className="bg-black/30 border border-siso-text/10 rounded-lg p-6 transition-all duration-300 hover:border-siso-orange/50 hover:shadow-lg">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white text-lg">{project.app_name}</h3>
            <Badge variant="outline" className={`${getStatusColor(project.status)} ml-2`}>
              {formatStatus(project.status)}
            </Badge>
          </div>
          
          {project.company_name && (
            <p className="text-sm text-siso-text mb-2">
              Company: {project.company_name}
            </p>
          )}
          
          <div className="space-y-2">
            <p className="text-xs text-siso-text">
              Created: {formatDate(project.created_at)}
            </p>
            <p className="text-xs text-siso-text">
              Estimated Cost: ${project.estimated_cost} • Timeline: {project.estimated_days} days
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleView}
            className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
          >
            <Eye className="h-4 w-4 mr-1" /> View
          </Button>
          
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-siso-text hover:text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border border-siso-text/20">
              <DropdownMenuItem 
                className="text-white hover:bg-siso-text/10 cursor-pointer"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
