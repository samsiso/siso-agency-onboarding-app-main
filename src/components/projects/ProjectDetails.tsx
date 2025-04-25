
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectHeader } from './details/ProjectHeader';
import { ProjectStatsCards } from './details/ProjectStatsCards';
import { ProjectCardNavigation } from './details/ProjectCardNavigation';
import { ProjectOverviewCards } from './details/ProjectOverviewCards';
import { ProjectMetricsDashboard } from './details/ProjectMetricsDashboard';
import { ActiveTasksSection } from './details/ActiveTasksSection';
import { DevelopmentProgress } from './details/DevelopmentProgress';

export function ProjectDetails() {
  const { id, tab } = useParams<{ id?: string; tab?: string }>();
  const projectId = id || 'ubahcrypt';
  const activeTab = tab || 'overview';
  
  const [projectData, setProjectData] = useState({
    name: 'UbahCrypt Project',
    description: 'A revolutionary blockchain-based cryptocurrency platform with enhanced security features and cross-chain capabilities.',
    status: 'ACTIVE',
    created_at: '2025-04-01T10:00:00Z',
  });

  // This would typically fetch project data from your API
  useEffect(() => {
    // Simulate API fetch
    // const fetchProject = async () => {
    //   const { data } = await supabase.from('projects').select('*').eq('id', projectId).single();
    //   if (data) setProjectData(data);
    // };
    // fetchProject();
    
    // For now using static data
  }, [projectId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="mb-8">
              <ProjectStatsCards />
            </div>
            <div className="mb-8">
              <ProjectMetricsDashboard projectId={projectId} />
            </div>
            <div className="mb-8">
              <DevelopmentProgress />
            </div>
            <ProjectOverviewCards projectId={projectId} />
          </>
        );
      case 'active-tasks':
        return <ActiveTasksSection />;
      default:
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10">
            <p>Content for {activeTab} tab is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <ProjectHeader 
        name={projectData.name} 
        description={projectData.description} 
        status={projectData.status} 
        created_at={projectData.created_at} 
      />
      <ProjectCardNavigation projectId={projectId} />
      {renderTabContent()}
    </div>
  );
}
