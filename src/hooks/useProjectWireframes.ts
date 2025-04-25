
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Wireframe } from '@/components/projects/wireframes/WireframeNavigation';

interface Connection {
  from: string;
  to: string;
  label?: string;
}

export function useProjectWireframes() {
  const { id: projectId } = useParams<{ id: string }>();
  const [wireframes, setWireframes] = useState<Wireframe[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWireframeId, setActiveWireframeId] = useState<string>('');

  useEffect(() => {
    // For this initial implementation, we'll use sample data
    // In a real implementation, this would fetch from the database
    
    const sampleWireframes: Wireframe[] = [
      {
        id: '1',
        title: 'Homepage Layout',
        imageUrl: '/lovable-uploads/8e5ff417-0826-4bc1-8afb-09cc8b6912c4.png',
        category: 'page',
        description: 'Main homepage layout with navigation and feature highlights'
      },
      {
        id: '2',
        title: 'Dashboard',
        imageUrl: '/lovable-uploads/5ba92f91-0e4b-4f5d-9ed2-ae6e93c895a4.png',
        category: 'page',
        description: 'User dashboard with stats and recent activity'
      },
      {
        id: '3',
        title: 'User Profile',
        imageUrl: '/lovable-uploads/3c3971c1-be81-477f-97b6-655fcbdf4eb6.png',
        category: 'page',
        description: 'User profile page with settings'
      },
      {
        id: '4',
        title: 'Navigation Menu',
        imageUrl: '/lovable-uploads/1d736dcc-8143-4ce7-847a-ee550725c708.png',
        category: 'component',
        description: 'Main navigation component used across the application'
      },
      {
        id: '5',
        title: 'Login Flow',
        imageUrl: '/lovable-uploads/5debc3cd-29a5-4b65-a577-32749c7917c7.png',
        category: 'user-flow',
        description: 'Complete user login process flow'
      }
    ];
    
    const sampleConnections: Connection[] = [
      {
        from: '1',
        to: '2',
        label: 'Login'
      },
      {
        from: '2',
        to: '3',
        label: 'View Profile'
      },
      {
        from: '3',
        to: '2',
        label: 'Back'
      }
    ];
    
    setWireframes(sampleWireframes);
    setConnections(sampleConnections);
    
    if (sampleWireframes.length > 0) {
      setActiveWireframeId(sampleWireframes[0].id);
    }
    
    setLoading(false);
    
    // In a real implementation we would fetch from the database like this:
    /*
    const fetchWireframes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data: wireframesData, error: wireframesError } = await supabase
          .from('project_wireframes')
          .select('*')
          .eq('project_id', projectId);
          
        if (wireframesError) {
          throw wireframesError;
        }
        
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('wireframe_connections')
          .select('*')
          .eq('project_id', projectId);
          
        if (connectionsError) {
          throw connectionsError;
        }
        
        setWireframes(wireframesData);
        setConnections(connectionsData);
        
        if (wireframesData.length > 0) {
          setActiveWireframeId(wireframesData[0].id);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load wireframes';
        setError(errorMessage);
        toast({
          title: "Error loading wireframes",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWireframes();
    */
    
  }, [projectId]);
  
  const activeWireframe = wireframes.find(w => w.id === activeWireframeId);
  
  const downloadWireframe = () => {
    if (!activeWireframe?.imageUrl) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = activeWireframe.imageUrl;
    link.download = `${activeWireframe.title.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Downloading ${activeWireframe.title}`,
    });
  };
  
  return {
    wireframes,
    connections,
    loading,
    error,
    activeWireframeId,
    setActiveWireframeId,
    activeWireframe,
    downloadWireframe
  };
}
