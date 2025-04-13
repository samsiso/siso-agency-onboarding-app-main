
import { SetupChecklist } from '@/components/home/SetupChecklist';
import { DashboardStats } from './DashboardStats';
import { QuickActions } from './QuickActions';
import { DashboardCard } from './DashboardCard';
import { ClientsOverviewCard } from './cards/ClientsOverviewCard';
import { RevenueCard } from './cards/RevenueCard';
import { CalendarCard } from './cards/CalendarCard';
import { RecentActivityCard } from './cards/RecentActivityCard';
import { ProjectsOverviewCard } from './cards/ProjectsOverviewCard';
import { PriorityTasksCard } from './cards/PriorityTasksCard';
import { 
  Calendar,
  MessageSquare,
  LineChart,
  Layout, 
  Folder, 
  Users, 
  CreditCard, 
  Bot, 
  BookOpen 
} from 'lucide-react';

export function MasonryDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto">
      {/* Top Section - Full Width */}
      <div className="col-span-1 md:col-span-3">
        <SetupChecklist />
      </div>
      
      {/* Stats Row */}
      <div className="col-span-1 md:col-span-3">
        <DashboardStats />
      </div>

      {/* Quick Actions */}
      <div className="col-span-1 md:col-span-3">
        <QuickActions />
      </div>

      {/* Left Column - Clients & Projects */}
      <div className="col-span-1 md:col-span-2 space-y-6">
        <ClientsOverviewCard />
        <ProjectsOverviewCard />
      </div>

      {/* Right Column - Calendar, Activity */}
      <div className="col-span-1 space-y-6">
        <CalendarCard />
        <RevenueCard />
        <PriorityTasksCard />
      </div>

      {/* Recent Activity - Full Width */}
      <div className="col-span-1 md:col-span-3">
        <RecentActivityCard />
      </div>

      {/* Feature Cards */}
      <div className="col-span-1 md:col-span-3">
        <h2 className="text-xl font-semibold text-white mb-5">Agency Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <DashboardCard
            title="Plan Builder" 
            description="Create app plans and cost estimates for your clients."
            icon={Layout}
            href="/plan-builder"
            delay={3}
          />
          <DashboardCard
            title="My Projects" 
            description="Manage your ongoing projects and track progress."
            icon={Folder}
            href="/my-projects"
            delay={4}
          />
          <DashboardCard
            title="Client Portal" 
            description="View and showcase your completed projects."
            icon={Users}
            href="/portfolio"
            delay={5}
          />
          <DashboardCard
            title="Payments" 
            description="Manage payments and transactions for your projects."
            icon={CreditCard}
            href="/payments"
            delay={6}
          />
          <DashboardCard
            title="AI Assistants" 
            description="Get help from AI to streamline your workflow."
            icon={Bot}
            href="/assistants"
            delay={7}
          />
          <DashboardCard
            title="Education" 
            description="Learn best practices for app development and client management."
            icon={BookOpen}
            href="/education"
            delay={8}
          />
        </div>
      </div>
    </div>
  );
}
