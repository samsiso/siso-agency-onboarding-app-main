
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "@/components/ui/nav-link";
import { 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  ListTodo,
  CheckSquare,
  ArrowRight
} from "lucide-react";
import { CircularProgress } from "./CircularProgress";

interface ProjectMetricsDashboardProps {
  projectId: string;
}

export function ProjectMetricsDashboard({ projectId }: ProjectMetricsDashboardProps) {
  // The following data would typically come from your API or state management
  const projectData = {
    overallProgress: 25,
    phases: [
      { name: "Phase 1: Initial Setup & Web3 Integration", progress: 50, status: "in-progress" },
      { name: "Phase 2: UI & Dashboard", progress: 0, status: "upcoming" },
      { name: "Phase 3: P2P, Staking, Security", progress: 0, status: "upcoming" },
      { name: "Phase 4: Community, Final Testing", progress: 0, status: "upcoming" }
    ],
    nextMilestone: {
      name: "Phase 1 Completion",
      date: "May 21, 2025",
      tasksCompleted: 3,
      totalTasks: 6
    },
    timeline: {
      remaining: "35 days",
      endDate: "June 6, 2025",
      progress: 25
    },
    credits: {
      spent: 614,
      tokens: "78,592,000",
      value: "£153.50",
      totalValue: "£6,000"
    },
    outstandingActions: {
      count: 1,
      action: "Make Upfront Payment (£900)"
    },
    messages: {
      latest: "Web3 integration update",
      update: "Completed Initial Setup & Planning",
      date: "May 2, 2025"
    }
  };

  const getStatusBadge = (progress: number) => {
    if (progress >= 70) {
      return <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">On track</Badge>;
    } else if (progress >= 40) {
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">In progress</Badge>;
    } else if (progress > 0) {
      return <Badge variant="outline" className="bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/20">Just started</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/20">Upcoming</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white mb-2">Project Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Progress Card */}
        <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
            {getStatusBadge(projectData.overallProgress)}
          </div>
          
          <div className="flex items-center justify-center py-4">
            <CircularProgress 
              percentage={projectData.overallProgress} 
              size={150} 
              strokeWidth={15}
              className="mb-4"
            />
          </div>
          
          <p className="text-neutral-400 text-sm mb-4">
            {projectData.overallProgress}% complete - halfway through Phase 1 of 4 phases
          </p>
          
          <NavLink
            href={`/projects/${projectId}/timeline`}
            className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
          >
            View Timeline <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Card>
        
        {/* Phase Progress Card */}
        <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-white">Phase Progress</h3>
          </div>
          
          <div className="space-y-4">
            {projectData.phases.map((phase, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white">{phase.name}</span>
                  <span className="text-xs text-neutral-400">{phase.progress}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={phase.progress} 
                    className="h-2 flex-grow"
                    indicatorClassName={
                      phase.progress >= 70 ? 'bg-green-500' : 
                      phase.progress >= 40 ? 'bg-amber-500' : 
                      phase.progress > 0 ? 'bg-[#ea384c]' : 'bg-gray-500/50'
                    }
                  />
                  {getStatusBadge(phase.progress)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <NavLink
              href={`/projects/${projectId}/timeline`}
              className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
            >
              View Timeline <ArrowRight className="ml-2 h-4 w-4" />
            </NavLink>
          </div>
        </Card>
        
        {/* Next Milestone Card */}
        <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-[#ea384c] mr-2" />
            <h3 className="text-lg font-semibold text-white">Next Milestone</h3>
          </div>
          
          <div className="mb-4">
            <h4 className="text-xl font-bold text-white">{projectData.nextMilestone.name}</h4>
            <p className="text-neutral-400">{projectData.nextMilestone.date}</p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-neutral-400">Tasks completed</span>
              <span className="text-sm text-white">{projectData.nextMilestone.tasksCompleted}/{projectData.nextMilestone.totalTasks}</span>
            </div>
            <Progress 
              value={(projectData.nextMilestone.tasksCompleted / projectData.nextMilestone.totalTasks) * 100} 
              className="h-2"
              indicatorClassName="bg-amber-500"
            />
          </div>
          
          <NavLink
            href={`/projects/${projectId}/active-tasks`}
            className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
          >
            View Tasks <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Card>
        
        {/* Timeline Remaining Card */}
        <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-[#ea384c] mr-2" />
            <h3 className="text-lg font-semibold text-white">Timeline Remaining</h3>
          </div>
          
          <div className="mb-4">
            <h4 className="text-xl font-bold text-white">{projectData.timeline.remaining}</h4>
            <p className="text-neutral-400">Project ends {projectData.timeline.endDate}</p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-neutral-400">Project timeline</span>
              <span className="text-sm text-white">{projectData.timeline.progress}% complete</span>
            </div>
            <Progress 
              value={projectData.timeline.progress} 
              className="h-2"
              indicatorClassName="bg-amber-500"
            />
          </div>
          
          <NavLink
            href={`/projects/${projectId}/timeline`}
            className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
          >
            View Timeline <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Card>
        
        {/* Credits Spent Card */}
        <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-[#ea384c] mr-2" />
            <h3 className="text-lg font-semibold text-white">Credits Spent</h3>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-neutral-400">Credits used</span>
              <span className="text-white font-medium">{projectData.credits.spent} credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Tokens processed</span>
              <span className="text-white font-medium">{projectData.credits.tokens}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Value</span>
              <span className="text-white font-medium">{projectData.credits.value}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Total project value</span>
              <span className="text-white font-medium">{projectData.credits.totalValue}</span>
            </div>
          </div>
          
          <NavLink
            href={`/projects/${projectId}/financial`}
            className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
          >
            View Financial Details <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Card>
        
        {/* Outstanding Actions Card */}
        <Card className="bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center mb-4">
            <ListTodo className="h-5 w-5 text-[#ea384c] mr-2" />
            <h3 className="text-lg font-semibold text-white">Outstanding Actions</h3>
          </div>
          
          {projectData.outstandingActions.count > 0 ? (
            <div className="space-y-4 mb-4">
              <div className="bg-black/50 p-4 rounded-md border border-white/5">
                <Badge className="mb-2 bg-[#ea384c]/10 text-[#ea384c] border-[#ea384c]/20">Due today</Badge>
                <p className="text-white">{projectData.outstandingActions.action}</p>
              </div>
            </div>
          ) : (
            <p className="text-neutral-400 mb-4">No outstanding actions at this time.</p>
          )}
          
          <NavLink
            href={`/projects/${projectId}/active-tasks`}
            className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
          >
            View Tasks <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Card>
        
        {/* Messages & Updates Card */}
        <Card className="md:col-span-2 bg-black/30 border border-white/10 p-6 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-5 w-5 text-[#ea384c] mr-2" />
            <h3 className="text-lg font-semibold text-white">Messages & Updates</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-black/50 p-4 rounded-md border border-white/5">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-[#ea384c] mr-2" />
                <h4 className="text-white font-medium">Latest Message</h4>
              </div>
              <p className="text-neutral-400">"{projectData.messages.latest}"</p>
            </div>
            
            <div className="bg-black/50 p-4 rounded-md border border-white/5">
              <div className="flex items-center mb-2">
                <CheckSquare className="h-4 w-4 text-green-400 mr-2" />
                <h4 className="text-white font-medium">Recent Update</h4>
              </div>
              <p className="text-neutral-400">{projectData.messages.update}</p>
              <p className="text-xs text-neutral-500 mt-1">{projectData.messages.date}</p>
            </div>
          </div>
          
          <NavLink
            href="/client-dashboard/messages"
            className="inline-flex items-center justify-center w-full bg-black/50 hover:bg-[#ea384c]/10 text-[#ea384c] px-4 py-2 rounded-md transition-colors"
          >
            View Messages <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Card>
      </div>
    </div>
  );
}
