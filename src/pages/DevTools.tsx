import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Code, 
  Cpu, 
  GitBranch, 
  Settings, 
  Layers,
  Play,
  Square,
  Monitor,
  FileCode,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';

// Import the core components we'll port from Claudia
import { ClaudeCodeSession } from '@/components/dev-tools/ClaudeCodeSession';
import { ProjectManager } from '@/components/dev-tools/ProjectManager';
import { AgentManager } from '@/components/dev-tools/AgentManager';
import { TerminalManager } from '@/components/dev-tools/TerminalManager';
import { CodeEditor } from '@/components/dev-tools/CodeEditor';
import { WindowControls } from '@/components/dev-tools/WindowControls';

interface Project {
  id: string;
  name: string;
  path: string;
  status: 'active' | 'idle' | 'error';
  agents: number;
  lastActivity: string;
}

interface Agent {
  id: string;
  name: string;
  type: 'researcher' | 'coder' | 'tester' | 'architect' | 'coordinator';
  status: 'running' | 'idle' | 'error';
  projectId: string;
  cpuUsage: number;
  memoryUsage: number;
}

export default function DevTools() {
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [systemStats, setSystemStats] = useState({
    activeProjects: 0,
    runningAgents: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    uptime: '0h 0m'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 'siso-main',
        name: 'SISO Agency Platform',
        path: '/workspace/siso-agency-onboarding-app',
        status: 'active',
        agents: 3,
        lastActivity: '2 minutes ago'
      },
      {
        id: 'client-portal',
        name: 'Client Portal Enhancement',
        path: '/workspace/client-portal',
        status: 'idle',
        agents: 1,
        lastActivity: '1 hour ago'
      },
      {
        id: 'instagram-automation',
        name: 'Instagram Lead Automation',
        path: '/workspace/instagram-leads',
        status: 'active',
        agents: 2,
        lastActivity: '5 minutes ago'
      }
    ];

    const mockAgents: Agent[] = [
      {
        id: 'agent-1',
        name: 'Frontend Architect',
        type: 'architect',
        status: 'running',
        projectId: 'siso-main',
        cpuUsage: 45,
        memoryUsage: 512
      },
      {
        id: 'agent-2',
        name: 'React Developer',
        type: 'coder',
        status: 'running',
        projectId: 'siso-main',
        cpuUsage: 65,
        memoryUsage: 768
      },
      {
        id: 'agent-3',
        name: 'Test Engineer',
        type: 'tester',
        status: 'idle',
        projectId: 'siso-main',
        cpuUsage: 12,
        memoryUsage: 256
      },
      {
        id: 'agent-4',
        name: 'API Researcher',
        type: 'researcher',
        status: 'running',
        projectId: 'instagram-automation',
        cpuUsage: 35,
        memoryUsage: 384
      },
      {
        id: 'agent-5',
        name: 'Backend Coordinator',
        type: 'coordinator',
        status: 'running',
        projectId: 'instagram-automation',
        cpuUsage: 28,
        memoryUsage: 320
      }
    ];

    setProjects(mockProjects);
    setAgents(mockAgents);

    // Calculate system stats
    const activeProjects = mockProjects.filter(p => p.status === 'active').length;
    const runningAgents = mockAgents.filter(a => a.status === 'running').length;
    const avgCpu = mockAgents.reduce((sum, a) => sum + a.cpuUsage, 0) / mockAgents.length;
    const totalMemory = mockAgents.reduce((sum, a) => sum + a.memoryUsage, 0);

    setSystemStats({
      activeProjects,
      runningAgents,
      cpuUsage: Math.round(avgCpu),
      memoryUsage: totalMemory,
      uptime: '2h 34m'
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'architect':
        return <Layers className="h-4 w-4" />;
      case 'coder':
        return <Code className="h-4 w-4" />;
      case 'tester':
        return <Zap className="h-4 w-4" />;
      case 'researcher':
        return <FileCode className="h-4 w-4" />;
      case 'coordinator':
        return <GitBranch className="h-4 w-4" />;
      default:
        return <Cpu className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <AdminPageTitle 
        title="SISO Agency Dev Tools"
        description="Multi-agent development environment with Claude Code integration"
      />
      
      <div className="space-y-6">
        {/* System Status */}
        <div className="flex items-center justify-end">
          <div className="text-right">
            <div className="text-sm text-gray-400">System Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{systemStats.activeProjects}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Running Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{systemStats.runningAgents}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">CPU Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{systemStats.cpuUsage}%</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{systemStats.memoryUsage}MB</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{systemStats.uptime}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="claude-session" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Claude Code
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Agents
              </TabsTrigger>
              <TabsTrigger value="terminals" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Terminals
              </TabsTrigger>
              <TabsTrigger value="code-editor" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Multi-Window Controls */}
              <WindowControls currentTab={activeTab} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Projects */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-orange-400" />
                      Active Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-gray-400">{project.path}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                            {project.status}
                          </Badge>
                          <span className="text-sm text-gray-400">{project.agents} agents</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Running Agents */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-green-400" />
                      Running Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {agents.filter(a => a.status === 'running').map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getAgentTypeIcon(agent.type)}
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-gray-400 capitalize">{agent.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">CPU: {agent.cpuUsage}%</div>
                          <div className="text-sm text-gray-400">RAM: {agent.memoryUsage}MB</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="claude-session">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-orange-400" />
                    Claude Code Session
                  </CardTitle>
                  <CardDescription>
                    Interactive Claude Code development environment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ClaudeCodeSession />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-orange-400" />
                    Project Manager
                  </CardTitle>
                  <CardDescription>
                    Manage multiple development projects and their configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectManager projects={projects} onProjectUpdate={setProjects} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-green-400" />
                    Agent Manager
                  </CardTitle>
                  <CardDescription>
                    Deploy, monitor, and manage AI development agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AgentManager agents={agents} projects={projects} onAgentUpdate={setAgents} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terminals">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-blue-400" />
                    Terminal Manager
                  </CardTitle>
                  <CardDescription>
                    Multi-terminal environment for project development
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <TerminalManager projects={projects} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code-editor">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-400" />
                    Code Editor
                  </CardTitle>
                  <CardDescription>
                    Monaco Editor with project file integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <CodeEditor projects={projects} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AdminLayout>
  );
}