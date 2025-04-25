
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileSearch, FileCheck, Terminal, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectOverviewCardsProps {
  projectId: string;
}

export function ProjectOverviewCards({ projectId }: ProjectOverviewCardsProps) {
  const navigate = useNavigate();

  const stats = {
    research: {
      total: 12,
      recent: 4,
      lastUpdated: 'Apr 18, 2025'
    },
    appPlan: {
      totalPhases: 6,
      completedPhases: 2,
      currentPhase: 'Design & Prototyping'
    },
    apis: {
      total: 4,
      operational: 3,
      degraded: 1
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-purple-500/20 p-2 rounded-md">
              <FileSearch className="h-5 w-5 text-purple-400" />
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {stats.research.total} Documents
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">Research Documents</h3>
          <p className="text-neutral-400 text-sm mb-4 flex-grow">
            Access our market analysis, technical research, and legal documents for Ubahcrypt.
          </p>

          <div className="flex flex-col space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Recently Added</span>
              <span className="text-white">{stats.research.recent} documents</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Last Updated</span>
              <span className="text-white">{stats.research.lastUpdated}</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 flex justify-between w-full"
            onClick={() => navigate(`/projects/${projectId}/research`)}
          >
            <span>View All Research</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-blue-500/20 p-2 rounded-md">
              <FileCheck className="h-5 w-5 text-blue-400" />
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              Phase {stats.appPlan.completedPhases}/{stats.appPlan.totalPhases}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">App Development Plan</h3>
          <p className="text-neutral-400 text-sm mb-4 flex-grow">
            Comprehensive development roadmap and technical specifications for Ubahcrypt.
          </p>

          <div className="flex flex-col space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Current Phase</span>
              <span className="text-white">{stats.appPlan.currentPhase}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Progress</span>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 h-1.5 w-24 rounded-full">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(stats.appPlan.completedPhases/stats.appPlan.totalPhases) * 100}%` }}></div>
                </div>
                <span className="text-white">{Math.round((stats.appPlan.completedPhases/stats.appPlan.totalPhases) * 100)}%</span>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 flex justify-between w-full"
            onClick={() => navigate(`/projects/${projectId}/app-plan`)}
          >
            <span>View Full Plan</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-green-500/20 p-2 rounded-md">
              <Terminal className="h-5 w-5 text-green-400" />
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              {stats.apis.total} APIs
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">APIs Integration</h3>
          <p className="text-neutral-400 text-sm mb-4 flex-grow">
            Documentation and status for all Ubahcrypt API endpoints and services.
          </p>

          <div className="flex flex-col space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Operational</span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-white">{stats.apis.operational} APIs</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Degraded</span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span className="text-white">{stats.apis.degraded} APIs</span>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            className="text-green-400 hover:text-green-300 hover:bg-green-500/10 flex justify-between w-full"
            onClick={() => navigate(`/projects/${projectId}/apis`)}
          >
            <span>View API Details</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
