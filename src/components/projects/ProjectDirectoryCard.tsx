
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectDirectoryCardProps {
  name?: string;
  logo?: string;
  onSelect?: () => void;
}

export function ProjectDirectoryCard({ name, logo, onSelect }: ProjectDirectoryCardProps) {
  const navigate = useNavigate();

  if (!name) {
    return (
      <Card 
        onClick={() => navigate('/plan-builder')}
        className="p-8 flex flex-col items-center justify-center gap-4 cursor-pointer bg-black/30 border border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300"
      >
        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
          <Plus size={40} className="text-siso-orange" />
        </div>
        <h3 className="text-xl font-semibold text-white">Start New Project</h3>
        <p className="text-sm text-siso-text text-center">
          Create your first project to start managing tasks
        </p>
      </Card>
    );
  }

  return (
    <Card 
      onClick={onSelect}
      className="p-8 flex flex-col items-center justify-center gap-4 cursor-pointer bg-black/30 border border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300"
    >
      {logo ? (
        <img src={logo} alt={name} className="h-20 w-20 rounded-full object-cover" />
      ) : (
        <div className="h-20 w-20 rounded-full bg-gradient-to-r from-siso-red to-siso-orange flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {name.charAt(0)}
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <Button 
        variant="outline"
        className="border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
      >
        View Tasks
      </Button>
    </Card>
  );
}
