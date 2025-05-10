import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client'; 
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
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    authenticated: boolean;
    error?: string;
    isProxyAuth?: boolean;
    usingMcp?: boolean;
  } | null>(null);

  // Detect if we're running in MCP environment
  const isMcpEnvironment = typeof window !== 'undefined' && (
    window.location.port === '8083' || 
    window.location.host.includes('mcp') ||
    window.location.href.includes('localhost:8083')
  );

  // Get full set of wireframes for the UbahCrypt project
  const getFullWireframesSet = () => {
    return [
      {
        id: "1",
        title: "Login/Signup Page",
        category: "page",
        description: "User authentication and account creation interface",
        notionUiPlanLink: "https://www.notion.so/Login-Signup-Page-1e849797be68802f8803e8671c05c518?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "pending"
      },
      {
        id: "2",
        title: "Onboarding/Tutorial Page",
        category: "page",
        description: "First-time user experience with step-by-step tutorials",
        notionUiPlanLink: "https://www.notion.so/Onboarding-Tutorial-Page-1e849797be68805a9d69f05b5781b9a1?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "pending"
      },
      {
        id: "3",
        title: "Dashboard",
        category: "page",
        description: "Main dashboard with key metrics and user information",
        notionUiPlanLink: "https://www.notion.so/Dashboard-1e849797be6880f89473f75ef252f8a9?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "pending"
      },
      {
        id: "4",
        title: "Markets Page",
        category: "page",
        description: "Cryptocurrency market listings with real-time price data",
        notionUiPlanLink: "https://www.notion.so/Markets-Page-1e849797be688011928ee483a7ccd276?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "in-review",
        devStatus: "pending"
      },
      {
        id: "5",
        title: "News Page",
        category: "page",
        description: "Latest cryptocurrency and blockchain news",
        notionUiPlanLink: "https://www.notion.so/News-Page-1e849797be68800d9409c5ac93576035?pvs=21",
        wireframeStatus: "in-progress",
        specsStatus: "pending",
        devStatus: "pending"
      },
      {
        id: "6",
        title: "Wallet Page",
        category: "page",
        description: "Crypto wallet management and asset storage",
        notionUiPlanLink: "https://www.notion.so/Wallet-Page-1e849797be6880888511e402d0c8c22b?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "pending"
      },
      {
        id: "7",
        title: "Portfolio Page",
        category: "page",
        description: "User asset portfolio with performance metrics",
        notionUiPlanLink: "https://www.notion.so/Portfolio-Page-1e849797be6880e4bdfcd690c879e0c8?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "in-progress"
      },
      {
        id: "8",
        title: "Trading Page",
        category: "page",
        description: "Advanced trading interface with charts and order books",
        notionUiPlanLink: "https://www.notion.so/Trading-Page-1e849797be688024a0fcc17a14ad2d24?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "in-progress"
      },
      {
        id: "9",
        title: "Open Orders Page",
        category: "page",
        description: "View and manage active trading orders",
        notionUiPlanLink: "https://www.notion.so/Open-Orders-Page-1e849797be688044b715c230b834da69?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "pending",
        devStatus: "pending"
      },
      {
        id: "10",
        title: "Transaction History Page",
        category: "page",
        description: "Complete history of user transactions with filtering options",
        notionUiPlanLink: "https://www.notion.so/Transaction-History-Page-1e849797be68804ebdc2c0e23e20109c?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "pending",
        devStatus: "pending"
      },
      {
        id: "11",
        title: "Transaction Fee Estimator Page",
        category: "page",
        description: "Calculate and estimate transaction fees before confirming",
        notionUiPlanLink: "https://www.notion.so/Transaction-Fee-Estimator-Page-1e849797be6880ae804ffe752399b065?pvs=21",
        wireframeStatus: "in-progress",
        specsStatus: "pending",
        devStatus: "pending"
      },
      {
        id: "12",
        title: "Staking Page",
        category: "page",
        description: "Cryptocurrency staking options and rewards",
        notionUiPlanLink: "https://www.notion.so/Staking-Page-1e849797be688000a6a9c1cd7cc61a3f?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "pending",
        devStatus: "pending"
      },
      {
        id: "13",
        title: "NFT Marketplace",
        category: "page",
        description: "Browse and purchase non-fungible tokens",
        notionUiPlanLink: "https://www.notion.so/NFT-Marketplace-1e849797be688000a6a9c1cd7cc61a3f?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "pending"
      },
      {
        id: "14",
        title: "Security Settings",
        category: "page",
        description: "Configure account security preferences and 2FA options",
        notionUiPlanLink: "https://www.notion.so/Security-Settings-1e849797be6880ae804ffe752399b065?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "pending"
      },
      {
        id: "15",
        title: "Profile Settings",
        category: "page",
        description: "User profile configuration and preferences",
        notionUiPlanLink: "https://www.notion.so/Profile-Settings-1e849797be68800d9409c5ac93576035?pvs=21",
        wireframeStatus: "complete",
        specsStatus: "approved",
        devStatus: "in-progress"
      }
    ];
  };

  // Complete set of connections between wireframes
  const getFullConnections = () => {
    return [
      { from: '1', to: '2', label: 'Sign up' },
      { from: '2', to: '3', label: 'Complete onboarding' },
      { from: '3', to: '4', label: 'View markets' },
      { from: '3', to: '5', label: 'View news' },
      { from: '3', to: '6', label: 'Open wallet' },
      { from: '3', to: '7', label: 'View portfolio' },
      { from: '4', to: '8', label: 'Trade' },
      { from: '8', to: '9', label: 'View orders' },
      { from: '7', to: '10', label: 'Transaction history' },
      { from: '6', to: '11', label: 'Estimate fee' },
      { from: '7', to: '12', label: 'Stake assets' },
      { from: '3', to: '13', label: 'Browse NFTs' },
      { from: '3', to: '14', label: 'Security' },
      { from: '3', to: '15', label: 'Profile' }
    ];
  };

  // Get complete set of wireframes
  const allWireframes = getFullWireframesSet();
  const allConnections = getFullConnections();

  // Load all wireframes for this project directly (used in MCP mode)
  const loadAllWireframes = () => {
    console.log('Loading all wireframes for UbahCrypt project');
    setWireframes(allWireframes);
    setConnections(allConnections);
    
    if (allWireframes.length > 0) {
      setActiveWireframeId(allWireframes[0].id);
    }
  };

  useEffect(() => {
    const fetchWireframesFromDatabase = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!projectId) {
          throw new Error('No project ID provided');
        }
        
        // If in MCP environment, load all wireframes directly
        if (isMcpEnvironment) {
          console.log('Running in MCP environment, loading all wireframes');
          loadAllWireframes();
          setLoading(false);
          return;
        }

        // Check Supabase connection status
        const status = await checkSupabaseConnection();
        setConnectionStatus(status);
        
        if (!status.connected) {
          console.error('Supabase connection failed:', status.error);
          throw new Error(`Database connection failed: ${status.error || 'Unknown error'}`);
        }
        
        if (status.usingMcp) {
          // Direct load if using MCP connection
          loadAllWireframes();
          setLoading(false);
          return;
        }

        // Not in MCP mode, proceed with normal database fetch
        const { data, error } = await supabase
          .from('project_wireframes')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching wireframes:', error);
          if (error.code === 'PGRST301') {
            throw new Error('Authentication required: Please sign in to access the wireframes');
          } else {
            throw error;
          }
        }

        if (data && data.length > 0) {
          // Map database fields to Wireframe interface
          const mappedWireframes: Wireframe[] = data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            description: item.description,
            notionUiPlanLink: item.notion_link,
            wireframeStatus: item.wireframe_status,
            specsStatus: item.specs_status,
            devStatus: item.dev_status
          }));
          
          setWireframes(mappedWireframes);
          
          // Set the first wireframe as active
          if (mappedWireframes.length > 0) {
            setActiveWireframeId(mappedWireframes[0].id);
          }
          
          console.log(`Successfully loaded ${mappedWireframes.length} wireframes from database`);
        } else {
          console.log('No wireframes found in database, using full set');
          loadAllWireframes();
        }

        // Load full set of connections
        setConnections(allConnections);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load wireframes';
        console.error('Error in wireframes hook:', errorMessage);
        
        if (!isMcpEnvironment) {
          setError(errorMessage);
          
          // Add more details to the error based on connection status
          if (connectionStatus) {
            if (!connectionStatus.connected) {
              toast({
                title: "Database connection failed",
                description: connectionStatus.error || "Could not connect to Supabase",
                variant: "destructive"
              });
            } else if (!connectionStatus.authenticated) {
              toast({
                title: "Authentication required",
                description: "You need to be signed in to access wireframes",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Error loading wireframes",
                description: errorMessage,
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "Error loading wireframes",
              description: errorMessage,
              variant: "destructive"
            });
          }
        }
        
        // Always load all wireframes as fallback
        loadAllWireframes();
      } finally {
        setLoading(false);
      }
    };
    
    fetchWireframesFromDatabase();
  }, [projectId, isMcpEnvironment]);

  const activeWireframe = wireframes.find(w => w.id === activeWireframeId);

  const downloadWireframe = () => {
    toast({
      title: "No Download Available",
      description: `Wireframe images are not currently available for ${activeWireframe?.title || 'this wireframe'}`,
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
    downloadWireframe,
    connectionStatus,
    isMcpEnvironment
  };
}
