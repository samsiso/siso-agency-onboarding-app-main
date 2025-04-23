
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Bitcoin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectDirectoryCardProps {
  name?: string;
  logo?: string;
  description?: string;
  onSelect?: () => void;
}

export function ProjectDirectoryCard({ name, logo, description, onSelect }: ProjectDirectoryCardProps) {
  const navigate = useNavigate();

  if (!name) {
    return (
      <Card 
        onClick={() => navigate('/plan-builder')}
        className="p-8 flex flex-col items-center justify-center gap-4 cursor-pointer bg-black/30 border border-dashed border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300"
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
          <Plus size={48} className="text-siso-orange" />
        </div>
        <h3 className="text-xl font-semibold text-white">Start New Project</h3>
        <p className="text-sm text-siso-text text-center max-w-[200px]">
          Create your first project to start managing tasks
        </p>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onSelect}
      className="p-8 flex flex-col items-center justify-center gap-4 cursor-pointer bg-black/30 border border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 group"
    >
      <div className="relative">
        {logo ? (
          <img src={logo} alt={name} className="h-24 w-24 rounded-full object-cover ring-2 ring-siso-orange/20 group-hover:ring-siso-orange/40 transition-all duration-300" />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-2 ring-siso-orange/20 group-hover:ring-siso-orange/40 transition-all duration-300">
            <Bitcoin size={40} className="text-white" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white group-hover:text-siso-orange transition-colors duration-300">{name}</h3>
      {description && (
        <p className="text-sm text-siso-text text-center max-w-[280px]">
          {description}
        </p>
      )}
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          navigate('/projects/tasks');
        }}
        variant="outline"
        className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
      >
        View Tasks
      </Button>
    </Card>
  );
}
