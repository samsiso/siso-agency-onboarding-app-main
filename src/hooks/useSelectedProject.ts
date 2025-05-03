
import { useState, useEffect } from 'react';
import { useProjects } from './useProjects';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
}

export function useSelectedProject() {
  const { data: currentProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for projects - would be replaced with API call
  const [projects] = useState<Project[]>([
    { id: "ubahcrypt", name: "UbahCrypt Project", status: "active" },
    { id: "gritness", name: "Gritness", status: "paused" },
    { id: "nmconstruction", name: "NM Construction", status: "completed" }
  ]);

  // Parse the current project ID from the URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const projectIdIndex = pathParts.indexOf('projects') + 1;
    
    if (projectIdIndex > 0 && projectIdIndex < pathParts.length) {
      const projectId = pathParts[projectIdIndex];
      const found = projects.find(p => p.id === projectId);
      
      if (found) {
        setSelectedProject(found);
      }
    } else if (currentProject) {
      // Fallback to the current project from useProjects hook
      setSelectedProject({
        id: currentProject.id || 'ubahcrypt',
        name: currentProject.name || 'UbahCrypt Project',
        status: 'active'
      });
    }
  }, [location.pathname, currentProject, projects]);

  // Function to select a project and navigate to it
  const selectProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return {
    selectedProject,
    projects,
    selectProject
  };
}
