interface Project {
  id: string;
  name: string;
  description: string;
  website_url: string;
  points: number;
  spending: number;
  siso_tokens: number;
  milestones_achieved: string;
  client_engagement: number;
  community_impact: number;
  updated_at: string;
  status: string;
  rank: number;
  features?: string[];
  technologies?: string[];
  techStack?: {
    frontend: string[];
    backend: string[];
    devops: string[];
  };
  timeline?: {
    started: string;
    phases: {
      name: string;
      description: string;
      completed: boolean;
      date: string;
    }[];
  };
}

export const projectData: Project[] = [
  {
    id: '1',
    name: 'Optimal Construction',
    description: 'Building maintenance and construction services with a focus on commercial properties.',
    website_url: 'https://optimal-building-maintenance.vercel.app/',
    points: 1500,
    spending: 15000,
    siso_tokens: 3000,
    milestones_achieved: '4/8',
    client_engagement: 60,
    community_impact: 5,
    updated_at: '2025-03-01T00:00:00Z',
    status: 'in-progress',
    rank: 1,
    features: [
      'Real-time Project Management',
      'Service Scheduling System',
      'Cost Estimation Calculator',
      'Maintenance Tracking',
      'Client Portal Access'
    ],
    technologies: [
      'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Express'
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS', 'React Query', 'Redux'],
      backend: ['Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Socket.io'],
      devops: ['Docker', 'GitHub Actions', 'Vercel', 'Jest', 'Cypress']
    },
    timeline: {
      started: 'January 2025',
      phases: [
        {
          name: 'Planning',
          description: 'Project scoping and requirements gathering',
          completed: true,
          date: 'January 2025'
        },
        {
          name: 'Design',
          description: 'UI/UX design and architectural planning',
          completed: true,
          date: 'February 2025'
        },
        {
          name: 'Development',
          description: 'Building the core features and functionality',
          completed: false,
          date: 'March 2025'
        },
        {
          name: 'Launch',
          description: 'Final deployment and client handover',
          completed: false,
          date: 'April 2025'
        }
      ]
    }
  },
  {
    id: '2',
    name: 'UbahCryp',
    description: 'A cryptocurrency trading platform built with React and Web3 technologies.',
    website_url: 'https://ubahcrypcom.vercel.app/',
    points: 500,
    spending: 5000,
    siso_tokens: 1000,
    milestones_achieved: '8/8',
    client_engagement: 90,
    community_impact: 10,
    updated_at: '2025-03-20T00:00:00Z',
    status: 'completed',
    rank: 2,
    features: [
      'Real-time Trading Interface',
      'Wallet Integration',
      'Market Analytics Dashboard',
      'Portfolio Management',
      'Transaction History & Reporting'
    ],
    technologies: [
      'React', 'Web3.js', 'Ethers.js', 'Solidity', 'Node.js', 'Express', 'PostgreSQL'
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Web3.js', 'Redux', 'Recharts'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Ethers.js'],
      devops: ['AWS', 'Docker', 'GitHub Actions', 'Terraform', 'Kibana']
    },
    timeline: {
      started: 'November 2024',
      phases: [
        {
          name: 'Planning',
          description: 'Project scoping and requirements gathering',
          completed: true,
          date: 'November 2024'
        },
        {
          name: 'Design',
          description: 'UI/UX design and architectural planning',
          completed: true,
          date: 'December 2024'
        },
        {
          name: 'Development',
          description: 'Building the core features and functionality',
          completed: true,
          date: 'January-February 2025'
        },
        {
          name: 'Launch',
          description: 'Final deployment and client handover',
          completed: true,
          date: 'March 2025'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Gritness',
    description: 'A gym management and fitness tracking application with personalized workout plans.',
    website_url: 'https://gritnessgym.vercel.app/',
    points: 25,
    spending: 249,
    siso_tokens: 50,
    milestones_achieved: '6/8',
    client_engagement: 40,
    community_impact: 3,
    updated_at: '2025-05-09T00:00:00Z',
    status: 'in-progress',
    rank: 3,
    features: [
      'Member Management System',
      'Workout Plan Builder',
      'Fitness Progress Tracking',
      'Class Scheduling',
      'Nutrition Planning'
    ],
    technologies: [
      'React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Firebase', 'Cloud Functions'
    ]
  },
  {
    id: '4',
    name: 'Trojan MMA',
    description: 'MMA gym and training center website with membership management and class scheduling.',
    website_url: 'https://trojan-mma.vercel.app/',
    points: 25,
    spending: 249,
    siso_tokens: 50,
    milestones_achieved: '6/8',
    client_engagement: 35,
    community_impact: 2,
    updated_at: '2025-03-27T00:00:00Z',
    status: 'in-progress',
    rank: 4,
    features: [
      'Membership System',
      'Class Registration',
      'Instructor Profiles',
      'Event Calendar',
      'Payment Processing'
    ]
  },
  {
    id: '5',
    name: 'Lets Go',
    description: 'Travel and adventure booking platform with itinerary planning and group bookings.',
    website_url: 'https://lets-go-u7hh.vercel.app/',
    points: 25,
    spending: 249,
    siso_tokens: 50,
    milestones_achieved: '7/8',
    client_engagement: 80,
    community_impact: 4,
    updated_at: '2025-03-26T00:00:00Z',
    status: 'nearly-completed',
    rank: 5,
    features: [
      'Trip Planning',
      'Booking Management',
      'User Reviews',
      'Payment Processing',
      'Travel Recommendations'
    ]
  },
  {
    id: '6',
    name: 'NM Construction',
    description: 'Construction company website with project portfolio and service booking.',
    website_url: 'https://nm-construction.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '4/8',
    client_engagement: 50,
    community_impact: 1,
    updated_at: '2025-03-01T00:00:00Z',
    status: 'in-progress',
    rank: 6,
    features: [
      'Project Showcase',
      'Quote Generator',
      'Service Booking',
      'Team Profiles',
      'Client Testimonials'
    ]
  },
  {
    id: '7',
    name: 'Elementree',
    description: 'Arborist and tree care services website with booking system and maintenance tracking.',
    website_url: 'https://elementree.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '5/8',
    client_engagement: 30,
    community_impact: 1,
    updated_at: '2025-05-09T00:00:00Z',
    status: 'in-progress',
    rank: 7,
    features: [
      'Service Scheduling',
      'Tree Inventory',
      'Maintenance Records',
      'Quote Generation',
      'Emergency Services'
    ]
  },
  {
    id: '8',
    name: 'Mu Shin',
    description: 'Martial arts school and training center website with online class booking.',
    website_url: 'https://siso-mu-shin.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '8/8',
    client_engagement: 20,
    community_impact: 0,
    updated_at: '2025-03-20T00:00:00Z',
    status: 'declined',
    rank: 8,
    features: [
      'Class Scheduling',
      'Online Tutorials',
      'Membership Management',
      'Belt Progression Tracking',
      'Event Calendar'
    ]
  },
  {
    id: '9',
    name: '5 Star Hire',
    description: 'Equipment hire and rental service with inventory management and booking system.',
    website_url: 'https://5-star-hire.vercel.app/',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '3/8',
    client_engagement: 25,
    community_impact: 0,
    updated_at: '2025-05-09T00:00:00Z',
    status: 'early-progress',
    rank: 9,
    features: [
      'Equipment Inventory',
      'Online Booking',
      'Payment Processing',
      'Maintenance Tracking',
      'Delivery Scheduling'
    ]
  },
  {
    id: '10',
    name: 'Keegan Saas',
    description: 'SaaS platform for business management with CRM, project tracking, and analytics.',
    website_url: '',
    points: 0,
    spending: 0,
    siso_tokens: 0,
    milestones_achieved: '0/8',
    client_engagement: 15,
    community_impact: 0,
    updated_at: '2025-05-09T00:00:00Z',
    status: 'not-started',
    rank: 10,
    features: [
      'Customer Management',
      'Project Tracking',
      'Analytics Dashboard',
      'Task Management',
      'Reporting Tools'
    ]
  }
];
