import { Node, Edge } from 'reactflow';

export function getSampleNodes(projectId: string): Node[] {
  return [
    {
      id: '1',
      type: 'page',
      position: { x: 250, y: 0 },
      data: { 
        label: 'Login/Signup Page', 
        status: 'live',
        description: 'User authentication screen',
        details: {
          wireframeId: 'login-wireframe',
          implementationNotes: 'Includes social auth options and password recovery',
          requirements: ['Email/password auth', 'Google auth', 'Apple auth']
        }
      }
    },
    {
      id: '2',
      type: 'page',
      position: { x: 250, y: 150 },
      data: { 
        label: 'Onboarding', 
        status: 'live',
        description: 'First-time user experience',
        details: {
          wireframeId: 'onboarding-wireframe',
          requirements: ['Skippable tutorial', 'Account setup guidance', 'Preference selection']
        }
      }
    },
    {
      id: '3',
      type: 'page',
      position: { x: 250, y: 300 },
      data: { 
        label: 'Dashboard', 
        status: 'live',
        description: 'Main app dashboard',
        details: {
          wireframeId: 'dashboard-wireframe',
          implementationNotes: 'Central navigation hub for the application'
        }
      }
    },
    {
      id: '4',
      type: 'page',
      position: { x: 50, y: 450 },
      data: { 
        label: 'Markets', 
        status: 'live',
        description: 'Cryptocurrency market data',
        details: {
          wireframeId: 'markets-wireframe'
        }
      }
    },
    {
      id: '5',
      type: 'page',
      position: { x: 250, y: 450 },
      data: { 
        label: 'Wallet', 
        status: 'in-development',
        description: 'User crypto wallet',
        details: {
          wireframeId: 'wallet-wireframe',
          implementationNotes: 'Security is a top priority for this feature'
        }
      }
    },
    {
      id: '6',
      type: 'page',
      position: { x: 450, y: 450 },
      data: { 
        label: 'Portfolio', 
        status: 'in-development',
        description: 'Investment portfolio',
        details: {
          wireframeId: 'portfolio-wireframe'
        }
      }
    },
    {
      id: '7',
      type: 'action',
      position: { x: 50, y: 600 },
      data: { 
        label: 'View Market Details', 
        status: 'live',
        description: 'Detailed market info'
      }
    },
    {
      id: '8',
      type: 'decision',
      position: { x: 250, y: 600 },
      data: { 
        label: 'KYC Verified?', 
        status: 'in-development',
        description: 'Check if user completed KYC'
      }
    },
    {
      id: '9',
      type: 'page',
      position: { x: 150, y: 750 },
      data: { 
        label: 'KYC Verification', 
        status: 'planned',
        description: 'Identity verification'
      }
    },
    {
      id: '10',
      type: 'page',
      position: { x: 350, y: 750 },
      data: { 
        label: 'Trading', 
        status: 'planned',
        description: 'Cryptocurrency trading'
      }
    }
  ];
}

export function getSampleEdges(projectId: string): Edge[] {
  return [
    { id: 'e1-2', source: '1', target: '2', label: 'Sign up', animated: true },
    { id: 'e2-3', source: '2', target: '3', label: 'Complete onboarding' },
    { id: 'e3-4', source: '3', target: '4', label: 'View markets' },
    { id: 'e3-5', source: '3', target: '5', label: 'Access wallet' },
    { id: 'e3-6', source: '3', target: '6', label: 'Check portfolio' },
    { id: 'e4-7', source: '4', target: '7' },
    { id: 'e5-8', source: '5', target: '8', label: 'Trade' },
    { id: 'e8-9', source: '8', target: '9', label: 'No', type: 'smoothstep' },
    { id: 'e8-10', source: '8', target: '10', label: 'Yes', type: 'smoothstep' }
  ];
} 