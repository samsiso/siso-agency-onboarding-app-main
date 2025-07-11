import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Terminal, 
  Users, 
  Activity, 
  Settings as SettingsIcon,
  FolderOpen,
  Zap,
  BarChart,
  MessageSquare,
  Layers
} from 'lucide-react';

// Import all Claudia components
import { ClaudeCodeSession } from './ClaudeCodeSession';
import { FloatingPromptInput } from './FloatingPromptInput';
import { SessionList } from './SessionList';
import { ProjectList } from './ProjectList';
import { CCAgents } from './CCAgents';
import { AgentExecution } from './AgentExecution';
import { AgentRunsList } from './AgentRunsList';
import { AutonomousAgentMonitor } from './AutonomousAgentMonitor';
import { SupervisorDashboard } from './SupervisorDashboard';
import { SwarmDashboard } from './SwarmDashboard';
import { UsageDashboard } from './UsageDashboard';
import { TokenCounter } from './TokenCounter';
import { Settings } from './Settings';
import { MCPManager } from './MCPManager';
import { RunningSessionsView } from './RunningSessionsView';

// Import styles
import '@/claudia-styles.css';

interface ClaudiaMainProps {
  className?: string;
}

export const ClaudiaMain: React.FC<ClaudiaMainProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState("session");
  const [showFloatingPrompt, setShowFloatingPrompt] = useState(false);

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      {/* Token Counter - Always visible */}
      <div className="fixed top-4 right-4 z-50">
        <TokenCounter />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-10 gap-2 p-2">
          <TabsTrigger value="session" className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span className="hidden lg:inline">Session</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden lg:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden lg:inline">Agents</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden lg:inline">Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="supervisor" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden lg:inline">Supervisor</span>
          </TabsTrigger>
          <TabsTrigger value="swarm" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="hidden lg:inline">Swarm</span>
          </TabsTrigger>
          <TabsTrigger value="usage" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span className="hidden lg:inline">Usage</span>
          </TabsTrigger>
          <TabsTrigger value="mcp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden lg:inline">MCP</span>
          </TabsTrigger>
          <TabsTrigger value="running" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden lg:inline">Running</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden lg:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="session" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <Card className="p-4 overflow-auto">
                <h3 className="text-lg font-semibold mb-4">Claude Code Session</h3>
                <ClaudeCodeSession />
              </Card>
              <Card className="p-4 overflow-auto">
                <h3 className="text-lg font-semibold mb-4">Session History</h3>
                <SessionList />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <ProjectList />
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <Card className="p-4 overflow-auto">
                <CCAgents />
              </Card>
              <Card className="p-4 overflow-auto">
                <AgentRunsList />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <AutonomousAgentMonitor />
            </Card>
          </TabsContent>

          <TabsContent value="supervisor" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <SupervisorDashboard />
            </Card>
          </TabsContent>

          <TabsContent value="swarm" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <SwarmDashboard />
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <UsageDashboard />
            </Card>
          </TabsContent>

          <TabsContent value="mcp" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <MCPManager />
            </Card>
          </TabsContent>

          <TabsContent value="running" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <RunningSessionsView />
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="h-full">
            <Card className="h-full p-4 overflow-auto">
              <Settings />
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Floating Prompt Input */}
      {showFloatingPrompt && (
        <FloatingPromptInput
          onClose={() => setShowFloatingPrompt(false)}
          onSubmit={(prompt) => {
            console.log('Prompt submitted:', prompt);
            setShowFloatingPrompt(false);
          }}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowFloatingPrompt(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-110 z-40"
      >
        <Terminal className="w-6 h-6" />
      </button>
    </div>
  );
};