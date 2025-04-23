
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bitcoin, ExternalLink, GitBranch, Code, Server } from 'lucide-react';
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
        className="p-12 flex flex-col items-center justify-center gap-8 cursor-pointer bg-black/30 border border-dashed border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300"
      >
        <div className="h-40 w-40 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] flex items-center justify-center">
          <Bitcoin size={80} className="text-white" />
        </div>
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-semibold text-white">Start New Crypto Project</h3>
          <p className="text-siso-text max-w-xl text-lg">
            Begin your blockchain journey by creating a new cryptocurrency project
          </p>
          <Button 
            className="mt-6 bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 px-8 py-6 text-lg"
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
      className="p-8 bg-black/30 border border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 group w-full"
    >
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-40 w-40 rounded-full object-cover ring-4 ring-[#9b87f5]/20 group-hover:ring-[#9b87f5]/40 transition-all duration-300"
              loading="lazy"
            />
          ) : (
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#9b87f5] to-[#6E59A5] flex items-center justify-center ring-4 ring-[#9b87f5]/20 group-hover:ring-[#9b87f5]/40 transition-all duration-300">
              <Bitcoin size={64} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-grow space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-white group-hover:text-[#9b87f5] transition-colors duration-300">
                {name}
              </h3>
              <p className="text-base text-siso-text mt-2">
                Created on {formatDate(created_at || '', 'long')}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className="text-base px-4 py-1 bg-[#9b87f5]/20 text-[#9b87f5]"
            >
              {status}
            </Badge>
          </div>
          
          {description && (
            <p className="text-siso-text text-lg leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-siso-text">
                <Code size={16} />
                <span>Smart Contract</span>
              </div>
              <Progress value={80} className="h-2" indicatorClassName="bg-[#9b87f5]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-siso-text">
                <Server size={16} />
                <span>Backend Integration</span>
              </div>
              <Progress value={65} className="h-2" indicatorClassName="bg-[#9b87f5]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-siso-text">
                <GitBranch size={16} />
                <span>Testing</span>
              </div>
              <Progress value={45} className="h-2" indicatorClassName="bg-[#9b87f5]" />
            </div>
          </div>
          
          <div className="flex gap-4 mt-8">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                navigate('/projects/tasks');
              }}
              variant="outline"
              className="border-[#9b87f5]/30 text-[#9b87f5] hover:bg-[#9b87f5]/10 flex-1 py-6 text-lg"
            >
              View Development Tasks
            </Button>
            <Button 
              onClick={onSelect}
              className="bg-gradient-to-r from-[#9b87f5] to-[#6E59A5] hover:opacity-90 flex-1 py-6 text-lg"
            >
              Open Project Dashboard
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
