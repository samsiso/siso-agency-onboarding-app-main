
import { useState, useEffect } from 'react';
import { useProjects } from './useProjects';
import { useNavigate, useLocation } from 'react-router-dom';

export interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  logo?: string;
}

export function useSelectedProject() {
  const { data: currentProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for projects - would be replaced with API call
  const [projects] = useState<Project[]>([
    { 
      id: "ubahcrypt", 
      name: "UbahCrypt Project", 
      status: "active",
      logo: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
    },
    { 
      id: "gritness", 
      name: "Gritness", 
      status: "paused",
      logo: "/lovable-uploads/3b17a23d-630e-4e55-94bf-9d6fef9e6fc4.png"
    },
    { 
      id: "nmconstruction", 
      name: "NM Construction", 
      status: "completed",
      logo: "/lovable-uploads/67e004ed-6861-4d6a-b05e-d885a03e5c1e.png"
    }
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
        status: 'active',
        logo: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png"
      });
    } else {
      // Default to first project if nothing is selected
      setSelectedProject(projects[0]);
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
