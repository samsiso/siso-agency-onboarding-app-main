
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bitcoin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/lib/formatters';

interface ProjectDirectoryCardProps {
  name?: string;
  logo?: string;
  description?: string;
  status?: string;
  created_at?: string;
  onSelect?: () => void;
}

export function ProjectDirectoryCard({ 
  name, 
  logo, 
  description, 
  status = 'active',
  created_at,
  onSelect 
}: ProjectDirectoryCardProps) {
  const navigate = useNavigate();

  if (!name) {
    return (
      <Card 
        onClick={() => navigate('/plan-builder')}
        className="p-8 flex flex-col items-center justify-center gap-6 cursor-pointer bg-black/30 border border-dashed border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300"
      >
        <div className="h-32 w-32 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
          <Plus size={64} className="text-siso-orange" />
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-semibold text-white">Start New Project</h3>
          <p className="text-siso-text max-w-md">
            Create your first blockchain project and start managing your development tasks
          </p>
          <Button 
            className="mt-4 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90"
          >
            Create Project
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onSelect}
      className="p-8 bg-black/30 border border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-32 w-32 rounded-full object-cover ring-2 ring-siso-orange/20 group-hover:ring-siso-orange/40 transition-all duration-300"
              loading="lazy"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-2 ring-siso-orange/20 group-hover:ring-siso-orange/40 transition-all duration-300">
              <Bitcoin size={48} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-grow space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-white group-hover:text-siso-orange transition-colors duration-300">
                {name}
              </h3>
              <p className="text-sm text-siso-text mt-2">
                Created on {formatDate(created_at || '', 'long')}
              </p>
            </div>
            <Badge variant="success" className="text-sm">
              {status}
            </Badge>
          </div>
          
          {description && (
            <p className="text-siso-text text-base leading-relaxed">
              {description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-siso-text">
              <span>Project Progress</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/projects/tasks');
              }}
              variant="outline"
              className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10 flex-1"
            >
              View Tasks
            </Button>
            <Button 
              onClick={onSelect}
              className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 flex-1"
            >
              Open Project
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
