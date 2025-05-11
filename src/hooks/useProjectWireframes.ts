import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client'; 
import { toast } from '@/components/ui/use-toast';

// Types for wireframes and connections
export interface Wireframe {
  id: string;
  title: string;
  category: string;
  description: string;
  notionUiPlanLink?: string;
  wireframeStatus: 'planned' | 'in-progress' | 'complete';
  specsStatus: 'pending' | 'in-review' | 'approved';
  devStatus: 'pending' | 'in-progress' | 'complete';
  imageUrl?: string;
}

export interface Connection {
  from: string;
  to: string;
  label?: string;
}

// Complete list of sample wireframes to use as fallback
const SAMPLE_WIREFRAMES: Wireframe[] = [
  {
    id: "1",
    title: "Login/Signup Page",
    category: "page",
    description: "User authentication and account creation interface",
    notionUiPlanLink: "https://www.notion.so/Login-Signup-Page-1e849797be68802f8803e8671c05c518?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Login/Signup"
  },
  {
    id: "2",
    title: "Onboarding/Tutorial Page",
    category: "page",
    description: "First-time user experience with step-by-step tutorials",
    notionUiPlanLink: "https://www.notion.so/Onboarding-Tutorial-Page-1e849797be68805a9d69f05b5781b9a1?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Onboarding"
  },
  {
    id: "3",
    title: "Dashboard",
    category: "page",
    description: "Main dashboard with key metrics and user information",
    notionUiPlanLink: "https://www.notion.so/Dashboard-1e849797be6880f89473f75ef252f8a9?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Dashboard"
  },
  {
    id: "4",
    title: "Markets Page",
    category: "page",
    description: "Cryptocurrency market listings with real-time price data",
    notionUiPlanLink: "https://www.notion.so/Markets-Page-1e849797be688011928ee483a7ccd276?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "in-review",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Markets"
  },
  {
    id: "5",
    title: "News Page",
    category: "page",
    description: "Latest cryptocurrency and blockchain news",
    notionUiPlanLink: "https://www.notion.so/News-Page-1e849797be68800d9409c5ac93576035?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=News"
  },
  {
    id: "6",
    title: "Wallet Page",
    category: "page",
    description: "Crypto wallet management and asset storage",
    notionUiPlanLink: "https://www.notion.so/Wallet-Page-1e849797be6880888511e402d0c8c22b?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Wallet"
  },
  {
    id: "7",
    title: "Portfolio Page",
    category: "page",
    description: "User asset portfolio with performance metrics",
    notionUiPlanLink: "https://www.notion.so/Portfolio-Page-1e849797be6880e4bdfcd690c879e0c8?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "in-progress",
    imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Portfolio"
  },
  {
    id: "8",
    title: "Trading Page",
    category: "page",
    description: "Advanced trading interface with charts and order books",
    notionUiPlanLink: "https://www.notion.so/Trading-Page-1e849797be688024a0fcc17a14ad2d24?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "in-progress",
    imageUrl: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Trading"
  },
  {
    id: "9",
    title: "Open Orders Page",
    category: "page",
    description: "View and manage active trading orders",
    notionUiPlanLink: "https://www.notion.so/Open-Orders-Page-1e849797be688044b715c230b834da69?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Orders"
  },
  {
    id: "10",
    title: "Transaction History Page",
    category: "page",
    description: "Complete history of user transactions with filtering options",
    notionUiPlanLink: "https://www.notion.so/Transaction-History-Page-1e849797be68804ebdc2c0e23e20109c?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=History"
  },
  {
    id: "11",
    title: "Transaction Fee Estimator Page",
    category: "page",
    description: "Calculate and estimate transaction fees before confirming",
    notionUiPlanLink: "https://www.notion.so/Transaction-Fee-Estimator-Page-1e849797be6880ae804ffe752399b065?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Fees"
  },
  {
    id: "12",
    title: "Staking Page",
    category: "page",
    description: "Cryptocurrency staking options and rewards",
    notionUiPlanLink: "https://www.notion.so/Staking-Page-1e849797be688000a6a9c1cd7cc61a3f?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Staking"
  },
  {
    id: "13",
    title: "Earn/Interest Page",
    category: "page",
    description: "Earn interest on crypto holdings and investment options",
    notionUiPlanLink: "https://www.notion.so/Earn-Interest-Page-2e849797be68802f8803e8671c05c543?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Earn"
  },
  {
    id: "14",
    title: "NFT Marketplace",
    category: "page",
    description: "Browse, buy, and sell non-fungible tokens",
    notionUiPlanLink: "https://www.notion.so/NFT-Marketplace-3e849797be68805a9d69f05b5781b9c2?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "in-review",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=NFTs"
  },
  {
    id: "15",
    title: "Security Settings",
    category: "page",
    description: "User security preferences and two-factor authentication",
    notionUiPlanLink: "https://www.notion.so/Security-Settings-4e849797be6880f89473f75ef252f8b3?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "in-progress",
    imageUrl: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Security"
  },
  {
    id: "16",
    title: "Account Profile",
    category: "page",
    description: "User profile management and personal settings",
    notionUiPlanLink: "https://www.notion.so/Account-Profile-5e849797be688011928ee483a7ccd295?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "complete",
    imageUrl: "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Profile"
  },
  {
    id: "17",
    title: "Notification Center",
    category: "page",
    description: "User alerts, price notifications, and activity updates",
    notionUiPlanLink: "https://www.notion.so/Notification-Center-6e849797be68800d9409c5ac93576054?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "in-review",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Notifications"
  },
  {
    id: "18",
    title: "Help Center",
    category: "page",
    description: "Knowledge base, FAQs, and support resources",
    notionUiPlanLink: "https://www.notion.so/Help-Center-7e849797be6880888511e402d0c8c24a?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "complete",
    imageUrl: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Help"
  },
  {
    id: "19",
    title: "Referral Program",
    category: "page",
    description: "User referrals and reward tracking",
    notionUiPlanLink: "https://www.notion.so/Referral-Program-8e849797be6880e4bdfcd690c879e0e7?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Referrals"
  },
  {
    id: "20",
    title: "Deposit/Withdrawal Page",
    category: "page",
    description: "Fund account and withdraw cryptocurrencies",
    notionUiPlanLink: "https://www.notion.so/Deposit-Withdrawal-Page-9e849797be688024a0fcc17a14ad2d43?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "in-progress",
    imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Deposit"
  },
  {
    id: "21",
    title: "Payment Methods",
    category: "page",
    description: "Manage linked bank accounts and payment options",
    notionUiPlanLink: "https://www.notion.so/Payment-Methods-10849797be688044b715c230b834da78?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Payments"
  },
  {
    id: "22",
    title: "Analytics Dashboard",
    category: "page",
    description: "Advanced portfolio analytics and performance metrics",
    notionUiPlanLink: "https://www.notion.so/Analytics-Dashboard-11849797be68804ebdc2c0e23e20109d?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Analytics"
  },
  {
    id: "23",
    title: "Settings Page",
    category: "page",
    description: "App preferences and user settings",
    notionUiPlanLink: "https://www.notion.so/Settings-Page-12849797be6880ae804ffe752399b084?pvs=21",
    wireframeStatus: "complete",
    specsStatus: "approved",
    devStatus: "complete",
    imageUrl: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Settings"
  },
  {
    id: "24",
    title: "Cross-Chain Bridge",
    category: "page",
    description: "Transfer assets between different blockchain networks",
    notionUiPlanLink: "https://www.notion.so/Cross-Chain-Bridge-13849797be688000a6a9c1cd7cc61a4e?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "in-review",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Bridge"
  },
  {
    id: "25",
    title: "DeFi Dashboard",
    category: "page",
    description: "Decentralized finance opportunities and tracking",
    notionUiPlanLink: "https://www.notion.so/DeFi-Dashboard-14849797be68802f8803e8671c05c544?pvs=21",
    wireframeStatus: "in-progress",
    specsStatus: "pending",
    devStatus: "pending",
    imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=DeFi"
  }
];

// Sample connections between wireframes
const SAMPLE_CONNECTIONS: Connection[] = [
  { from: '1', to: '2', label: 'After signup' },
  { from: '2', to: '3', label: 'Complete onboarding' },
  { from: '3', to: '4', label: 'View markets' },
  { from: '3', to: '5', label: 'View news' },
  { from: '3', to: '6', label: 'Access wallet' },
  { from: '3', to: '7', label: 'View portfolio' },
  { from: '4', to: '8', label: 'Trade' },
  { from: '6', to: '20', label: 'Deposit/Withdraw' },
  { from: '6', to: '12', label: 'Stake crypto' },
  { from: '8', to: '9', label: 'View orders' },
  { from: '8', to: '10', label: 'View transaction history' },
  { from: '8', to: '11', label: 'Calculate fees' },
  { from: '7', to: '13', label: 'View earning options' },
  { from: '7', to: '22', label: 'View assets' },
  { from: '9', to: '16', label: 'Manage order' },
  { from: '13', to: '17', label: 'Deploy staking' },
  { from: '17', to: '18', label: 'View rewards' },
  { from: '14', to: '19', label: 'Purchase NFT' },
  { from: '15', to: '21', label: 'Enable 2FA' },
  { from: '21', to: '23', label: 'Add recovery options' },
  { from: '22', to: '24', label: 'View asset details' },
  { from: '19', to: '25', label: 'View NFT details' },
];

export function useProjectWireframes() {
  // All React hooks must be called unconditionally at the top level
  const { id: projectId } = useParams();
  const [wireframes, setWireframes] = useState<Wireframe[]>([]);
  const [connections, setConnections] = useState<Connection[]>(SAMPLE_CONNECTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWireframeId, setActiveWireframeId] = useState<string>('');
  
  // Use refs to track component mounting state and fetch attempts
  const isMountedRef = useRef(true);
  const fetchTriedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  
  // Function to load sample data when database fetch fails
  const loadSampleWireframesAsFallback = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log("Loading sample wireframe data as fallback");
    setWireframes(SAMPLE_WIREFRAMES);
    setConnections(SAMPLE_CONNECTIONS);
    
    if (SAMPLE_WIREFRAMES.length > 0) {
      setActiveWireframeId(SAMPLE_WIREFRAMES[0].id);
    }
    
    setLoading(false);
  }, []);

  // Fetch data effect
  useEffect(() => {
    // Set mounted ref to true on mount
    isMountedRef.current = true;
    
    // Function to fetch wireframes
    const fetchWireframesData = async () => {
      // Don't proceed if we've already tried fetching or component is unmounted
      if (fetchTriedRef.current || !isMountedRef.current) return;
      
      // Set loading state and mark fetch as attempted
      setLoading(true);
      setError(null);
      fetchTriedRef.current = true;

      try {
        // Try fetching with the project ID from URL or fallback to 'ubahcrypt'
        const currentProjectId = projectId || 'ubahcrypt';
        console.log("Fetching wireframes for project:", currentProjectId);

        // Use the raw query method to avoid type issues with custom tables
        const result = await supabase
          .rpc('get_project_wireframes', { project_id_param: currentProjectId })
          .catch(() => {
            // If the RPC doesn't exist, fallback to direct query
            return supabase
              .from('project_wireframes')
              .select('*')
              .eq('project_id', currentProjectId)
              .order('created_at', { ascending: false });
          });
        
        // Check if component is still mounted
        if (!isMountedRef.current) return;
        
        // Handle database error
        if (result.error) {
          console.error("Supabase error:", result.error);
          throw new Error(`Failed to fetch wireframes: ${result.error.message}`);
        }

        const data = result.data || [];
        
        // Process data if successful
        if (data && data.length > 0) {
          // Map database fields to Wireframe interface
          const mappedWireframes: Wireframe[] = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            category: item.category || 'page',
            description: item.description || '',
            notionUiPlanLink: item.notion_link,
            wireframeStatus: item.wireframe_status || 'planned',
            specsStatus: item.specs_status || 'pending',
            devStatus: item.dev_status || 'pending',
            imageUrl: item.image_url || `https://via.placeholder.com/300x200/6366F1/FFFFFF?text=${encodeURIComponent(item.title)}`
          }));
          
          // Only update state if component is still mounted
          if (isMountedRef.current) {
            setWireframes(mappedWireframes);
            
            // Set the first wireframe as active
            if (mappedWireframes.length > 0) {
              setActiveWireframeId(mappedWireframes[0].id);
            }
            setLoading(false);
          }
        } else {
          console.log("No wireframes found in database, using sample data");
          // Fallback to sample data if no wireframes were found
          if (isMountedRef.current) {
            loadSampleWireframesAsFallback();
          }
        }
      } catch (err: any) {
        console.error("Error fetching wireframes:", err);
        if (isMountedRef.current) {
          setError(err.message || "Failed to load wireframes");
          loadSampleWireframesAsFallback();
        }
      }
    };
    
    // Start the fetch process
    fetchWireframesData();
    
    // Setup the fallback timeout - use window.setTimeout to ensure proper cleanup
    timeoutRef.current = window.setTimeout(() => {
      if (isMountedRef.current && loading && wireframes.length === 0) {
        console.log("Loading timeout reached, forcing sample data");
        loadSampleWireframesAsFallback();
      }
    }, 3000);
    
    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [projectId, loadSampleWireframesAsFallback, loading, wireframes.length]);

  // Find active wireframe from the current state
  const activeWireframe = wireframes.find(w => w.id === activeWireframeId) || null;

  // Function for downloading a wireframe
  const downloadWireframe = useCallback(() => {
    toast({
      title: "No Download Available",
      description: `Wireframe images are not currently available for ${activeWireframe?.title || 'this wireframe'}`,
    });
  }, [activeWireframe]);

  // Return hook data
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
