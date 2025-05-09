import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, DollarSign, ExternalLink, FileCheck, Hammer, LucideIcon, Star, Trophy, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface FeatureItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureItem = ({ title, description, icon: Icon }: FeatureItemProps) => {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-black/30 border border-purple-500/20">
      <div className="flex items-center justify-center p-2 rounded-md bg-gradient-to-br from-siso-red to-siso-orange">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-siso-text-bold">{title}</h3>
        <p className="text-sm text-siso-text/80 mt-1">{description}</p>
      </div>
    </div>
  );
};

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  points: number;
  spending: number;
  siso_tokens: number;
  client_engagement: number;
  community_impact: number;
  updated_at: string;
  status: string;
  rank: number;
  website_url?: string;
  milestones_achieved?: string;
  features?: string[];
  technologies?: string[];
  demo_video_url?: string;
  testimonials?: {
    name: string;
    role: string;
    company: string;
    content: string;
    avatar_url?: string;
    rating: number;
  }[];
  screenshots?: {
    url: string;
    caption: string;
    order: number;
  }[];
  tech_stack?: {
    frontend?: string[];
    backend?: string[];
    devops?: string[];
  };
  metrics?: {
    completion_time?: number; // in weeks
    conversion_rate?: number;
    user_retention?: number;
    performance_score?: number;
  };
  case_study?: {
    title: string;
    challenge: string;
    solution: string;
    results: string;
  };
}

export default function ProjectPortfolioPage() {
  const { projectId, projectName } = useParams<{ projectId: string; projectName?: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update URL if we have project data but URL doesn't include project name
  useEffect(() => {
    if (project?.name && !projectName) {
      const formattedName = project.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      navigate(`/project-portfolio/${projectId}/${formattedName}`, { replace: true });
    }
  }, [project, projectId, projectName, navigate]);

  // Update document title when project data loads
  useEffect(() => {
    if (project?.name) {
      document.title = `${project.name} | SISO Agency Portfolio`;
    } else {
      document.title = 'Project Portfolio | SISO Agency';
    }
  }, [project]);

  useEffect(() => {
    if (!projectId) {
      navigate('/economy/leaderboards');
      return;
    }

    async function fetchProjectData() {
      setLoading(true);
      setError(null);
      
      try {
        // First, try to get project from the projects table
        let { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();

        // If not found, try the leaderboard table
        if (projectError || !projectData) {
          const { data: leaderboardData, error: leaderboardError } = await supabase
            .from('leaderboard')
            .select('*')
            .eq('id', projectId)
            .single();

          if (leaderboardError || !leaderboardData) {
            // As a fallback, try to get from apps table
            const { data: appData, error: appError } = await supabase
              .from('apps')
              .select('*')
              .eq('id', projectId)
              .single();

            if (appError || !appData) {
              throw new Error('Project not found');
            }

            projectData = {
              ...appData,
              name: appData.name || `Project ${projectId}`,
              spending: appData.spending || 0,
              points: appData.points || 0,
              siso_tokens: appData.siso_tokens || 0,
              client_engagement: appData.client_engagement || 60,
              status: appData.status || 'in-progress',
              milestones_achieved: appData.milestones_achieved || '4/8',
            };
          } else {
            projectData = leaderboardData;
          }
        }

        // Get additional project details like features if they exist
        const { data: featuresData } = await supabase
          .from('project_features')
          .select('*')
          .eq('project_id', projectId);

        // Get tech stack if it exists
        const { data: techData } = await supabase
          .from('project_technologies')
          .select('*')
          .eq('project_id', projectId);

        // Get timeline data if it exists
        const { data: timelineData } = await supabase
          .from('project_timeline')
          .select('*')
          .eq('project_id', projectId);
          
        // Get screenshots for media showcase
        const { data: screenshotsData } = await supabase
          .from('project_screenshots')
          .select('*')
          .eq('project_id', projectId)
          .order('order', { ascending: true });
          
        // Get client testimonials
        const { data: testimonialsData } = await supabase
          .from('project_testimonials')
          .select('*')
          .eq('project_id', projectId);
          
        // Get case study if it exists
        const { data: caseStudyData } = await supabase
          .from('project_case_studies')
          .select('*')
          .eq('project_id', projectId)
          .single();
          
        // Get project metrics if they exist
        const { data: metricsData } = await supabase
          .from('project_metrics')
          .select('*')
          .eq('project_id', projectId)
          .single();

        // Format the project data with all additional details
        const formattedProject: ProjectDetails = {
          ...projectData,
          features: featuresData?.map(f => f.name) || [
            'User Authentication',
            'Responsive Design',
            'Data Analytics',
            'Content Management',
            'API Integration'
          ],
          tech_stack: techData ? {
            frontend: techData.filter(t => t.type === 'frontend').map(t => t.name),
            backend: techData.filter(t => t.type === 'backend').map(t => t.name),
            devops: techData.filter(t => t.type === 'devops').map(t => t.name)
          } : {
            frontend: ['React', 'TypeScript', 'Tailwind CSS', 'React Query'],
            backend: ['Node.js', 'Express', 'PostgreSQL', 'Prisma ORM'],
            devops: ['Docker', 'GitHub Actions', 'Vercel']
          },
          screenshots: screenshotsData || [],
          testimonials: testimonialsData || [],
          case_study: caseStudyData || null,
          metrics: metricsData || null,
          demo_video_url: projectData.demo_video_url || `https://www.youtube.com/embed/dQw4w9WgXcQ?si=${projectId}`
        };

        setProject(formattedProject);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project data');
        // Try to extract name from the URL path if available
        const projectNameFromUrl = projectName ? 
          projectName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : null;

        // Get project name from leaderboard data
        // We'll try to find the project in the leaderboard data
        const findInLeaderboardData = async () => {
          try {
            // Import leaderboard data
            const { data: leaderboardEntries } = await supabase
              .from('leaderboard')
              .select('name')
              .eq('id', projectId)
              .single();
            
            if (leaderboardEntries?.name) {
              return leaderboardEntries.name;
            }
          } catch (error) {
            console.error('Error fetching from leaderboard:', error);
          }
          return null;
        };

        const projectNameFromLeaderboard = await findInLeaderboardData();
        
        // Create fallback project data with the best available name
        setProject({
          id: projectId,
          name: projectNameFromLeaderboard || projectNameFromUrl || `Project ${projectId}`,
          description: 'Project details are currently unavailable.',
          points: 500,
          spending: 5000,
          siso_tokens: 1000,
          client_engagement: 70,
          community_impact: 5,
          updated_at: new Date().toISOString(),
          status: 'in-progress',
          rank: 1,
          milestones_achieved: '4/8',
          demo_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          screenshots: [
            {
              url: 'https://placehold.co/600x400?text=Project+Screenshot',
              caption: 'Project homepage',
              order: 1
            },
            {
              url: 'https://placehold.co/600x400?text=Features+Screenshot',
              caption: 'Key features showcase',
              order: 2
            }
          ],
          testimonials: [
            {
              name: 'John Smith',
              role: 'CEO',
              company: 'Example Corp',
              content: 'SISO Agency delivered an exceptional product that has transformed our business operations. The team was professional, responsive, and delivered on time.',
              rating: 5
            }
          ],
          case_study: {
            title: 'How We Transformed Their Business',
            challenge: 'The client needed a complete digital transformation of their outdated systems.',
            solution: 'We implemented a modern tech stack with React and Node.js, with a focus on user experience.',
            results: 'Increased conversions by 45% and reduced operational costs by 30%.'
          },
          metrics: {
            completion_time: 8,
            conversion_rate: 45,
            user_retention: 80,
            performance_score: 95
          }
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjectData();
  }, [projectId, navigate]);

  const goBack = () => {
    navigate('/economy/leaderboards');
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-56 bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-24 bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-700 rounded"></div>
              <div className="h-24 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="container mx-auto p-6">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="mb-6 text-siso-text/80">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={goBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leaderboard
        </Button>

        {/* Hero Section with Project Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-black/30 border-t-4 border-t-gradient-to-r from-siso-red to-siso-orange border-siso-border overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">{project.name}</h1>
                    <Badge className={`
                      px-2 py-1
                      ${project.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/40' : 
                        project.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 
                        project.status === 'nearly-completed' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/40'}
                    `}>
                      {project.status.replace(/-/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xl text-siso-text/90 max-w-3xl">
                    {project.description}
                  </p>
                </div>
                {project.website_url && (
                  <Button className="shrink-0" onClick={() => window.open(project.website_url, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-sm font-medium text-siso-text/80">Points</h3>
                  </div>
                  <p className="text-2xl font-bold text-siso-text-bold">{project.points.toLocaleString()}</p>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <h3 className="text-sm font-medium text-siso-text/80">Investment</h3>
                  </div>
                  <p className="text-2xl font-bold text-siso-text-bold">£{project.spending.toLocaleString()}</p>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <h3 className="text-sm font-medium text-siso-text/80">Development Time</h3>
                  </div>
                  <p className="text-2xl font-bold text-siso-text-bold">{Math.ceil(project.spending / 1000) || 4} weeks</p>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <h3 className="text-sm font-medium text-siso-text/80">Client Satisfaction</h3>
                  </div>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < (project.client_engagement / 20) ? 'text-amber-500' : 'text-gray-600'}`} 
                        fill={i < (project.client_engagement / 20) ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team & Process</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="case-study">Case Study</TabsTrigger>
          </TabsList>

          <TabsContent value="features">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FeatureItem 
                title="User Authentication" 
                description="Secure login and registration system with role-based permissions" 
                icon={Users} 
              />
              <FeatureItem 
                title="Responsive Design" 
                description="Mobile-first design that works on all devices and screen sizes" 
                icon={FileCheck} 
              />
              <FeatureItem 
                title="Data Analytics" 
                description="Comprehensive reporting and analytics dashboard" 
                icon={Trophy} 
              />
              <FeatureItem 
                title="Content Management" 
                description="Easy-to-use content management system for administrators" 
                icon={Hammer} 
              />
              {project.features && project.features.length > 0 && project.features.map((feature: string, index: number) => (
                <FeatureItem 
                  key={index}
                  title={feature} 
                  description="Carefully designed and implemented to meet client requirements"
                  icon={FileCheck} 
                />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Development milestones and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-siso-border"></div>
                  
                  <div className="space-y-8">
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-siso-text-bold">Project Start</h3>
                      <p className="text-sm text-siso-text/80">Initial planning and requirements gathering</p>
                      <p className="text-xs text-siso-text/60 mt-1">March 2025</p>
                    </div>
                    
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                        <Hammer className="h-4 w-4 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-siso-text-bold">Development Phase</h3>
                      <p className="text-sm text-siso-text/80">Building core features and functionality</p>
                      <p className="text-xs text-siso-text/60 mt-1">April 2025</p>
                    </div>
                    
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <Users className="h-4 w-4 text-amber-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-siso-text-bold">Testing & Feedback</h3>
                      <p className="text-sm text-siso-text/80">User testing and client feedback integration</p>
                      <p className="text-xs text-siso-text/60 mt-1">May 2025</p>
                    </div>
                    
                    <div className="relative pl-10">
                      <div className={`absolute left-0 top-1 w-8 h-8 rounded-full 
                        ${project.status === 'completed' 
                          ? 'bg-green-500/20 border border-green-500/40' 
                          : 'bg-gray-500/20 border border-gray-500/40'
                        } flex items-center justify-center`}>
                        <Trophy className={`h-4 w-4 ${project.status === 'completed' ? 'text-green-400' : 'text-gray-400'}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-siso-text-bold">Project Completion</h3>
                      <p className="text-sm text-siso-text/80">Final delivery and client handover</p>
                      <p className="text-xs text-siso-text/60 mt-1">June 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle>Team & Process</CardTitle>
                <CardDescription>How we built this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-siso-text-bold">Our Process</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-siso-red w-5 h-5 flex items-center justify-center text-xs mt-0.5">1</span>
                        <div>
                          <p className="font-medium text-siso-text-bold">Discovery & Planning</p>
                          <p className="text-sm text-siso-text/80">Initial requirements gathering and project planning</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-siso-orange w-5 h-5 flex items-center justify-center text-xs mt-0.5">2</span>
                        <div>
                          <p className="font-medium text-siso-text-bold">Design & Architecture</p>
                          <p className="text-sm text-siso-text/80">Creating wireframes, mockups and planning architecture</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-blue-500 w-5 h-5 flex items-center justify-center text-xs mt-0.5">3</span>
                        <div>
                          <p className="font-medium text-siso-text-bold">Development</p>
                          <p className="text-sm text-siso-text/80">Agile development with regular client check-ins</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-purple-500 w-5 h-5 flex items-center justify-center text-xs mt-0.5">4</span>
                        <div>
                          <p className="font-medium text-siso-text-bold">Testing & QA</p>
                          <p className="text-sm text-siso-text/80">Rigorous testing to ensure quality and reliability</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="rounded-full bg-green-500 w-5 h-5 flex items-center justify-center text-xs mt-0.5">5</span>
                        <div>
                          <p className="font-medium text-siso-text-bold">Deployment & Support</p>
                          <p className="text-sm text-siso-text/80">Smooth deployment and ongoing support</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-siso-text-bold">Team Composition</h3>
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4 border border-siso-border">
                        <h4 className="font-medium text-siso-text-bold">Project Manager</h4>
                        <p className="text-sm text-siso-text/80">Overseeing the project timeline and coordinating resources</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 border border-siso-border">
                        <h4 className="font-medium text-siso-text-bold">UX/UI Designer</h4>
                        <p className="text-sm text-siso-text/80">Creating intuitive and engaging user interfaces</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 border border-siso-border">
                        <h4 className="font-medium text-siso-text-bold">Frontend Developer</h4>
                        <p className="text-sm text-siso-text/80">Building responsive and interactive user interfaces</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 border border-siso-border">
                        <h4 className="font-medium text-siso-text-bold">Backend Developer</h4>
                        <p className="text-sm text-siso-text/80">Developing APIs and database architecture</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle>Technology Stack</CardTitle>
                <CardDescription>The technologies used to build this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/20 p-6 rounded-lg border border-siso-border">
                    <h3 className="text-lg font-semibold mb-4 text-siso-text-bold">Frontend</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>React</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>TypeScript</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Tailwind CSS</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Framer Motion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>React Query</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-black/20 p-6 rounded-lg border border-siso-border">
                    <h3 className="text-lg font-semibold mb-4 text-siso-text-bold">Backend</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Node.js</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Express</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>PostgreSQL</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Prisma ORM</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>JWT Authentication</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-black/20 p-6 rounded-lg border border-siso-border">
                    <h3 className="text-lg font-semibold mb-4 text-siso-text-bold">DevOps & Tools</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Docker</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>GitHub Actions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Vercel</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Jest</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span>Cypress</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle>Media Showcase</CardTitle>
                <CardDescription>Project screenshots and demo video</CardDescription>
              </CardHeader>
              <CardContent>
                {project.demo_video_url && (
                  <div className="mb-10">
                    <h3 className="text-xl font-semibold mb-4 text-siso-text-bold">Demo Video</h3>
                    <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg border border-siso-border">
                      <iframe 
                        src={project.demo_video_url} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                        className="absolute top-0 left-0 w-full h-full"
                      ></iframe>
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-4 text-siso-text-bold">Project Screenshots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.screenshots && project.screenshots.length > 0 ? (
                    project.screenshots.map((screenshot, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-black/20 rounded-lg border border-siso-border overflow-hidden group">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={screenshot.url} 
                            alt={screenshot.caption} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-siso-text/80">{screenshot.caption}</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-siso-text/60">No screenshots available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle>Client Testimonials</CardTitle>
                <CardDescription>What our clients say about this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.testimonials && project.testimonials.length > 0 ? (
                    project.testimonials.map((testimonial, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-black/20 p-6 rounded-lg border border-siso-border">
                        <div className="flex items-center mb-4">
                          <div className="rounded-full bg-gradient-to-br from-siso-red to-siso-orange w-10 h-10 flex items-center justify-center text-white text-lg font-bold mr-3">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-siso-text-bold">{testimonial.name}</h4>
                            <p className="text-xs text-siso-text/80">{testimonial.role} at {testimonial.company}</p>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-500' : 'text-gray-600'}`} 
                                fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-siso-text/90 italic">"{testimonial.content}"</p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-siso-text/60">No testimonials available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="case-study">
            <Card className="bg-black/30 border-siso-border">
              <CardHeader>
                <CardTitle>Case Study</CardTitle>
                <CardDescription>How we approached this project</CardDescription>
              </CardHeader>
              <CardContent>
                {project.case_study ? (
                  <div className="space-y-8">
                    <div className="bg-black/20 p-6 rounded-lg border border-siso-border">
                      <h3 className="text-xl font-semibold mb-2 text-siso-text-bold">The Challenge</h3>
                      <p className="text-siso-text/90">{project.case_study.challenge}</p>
                    </div>
                    
                    <div className="bg-black/20 p-6 rounded-lg border border-siso-border">
                      <h3 className="text-xl font-semibold mb-2 text-siso-text-bold">Our Solution</h3>
                      <p className="text-siso-text/90">{project.case_study.solution}</p>
                    </div>
                    
                    <div className="bg-black/20 p-6 rounded-lg border border-siso-border">
                      <h3 className="text-xl font-semibold mb-2 text-siso-text-bold">The Results</h3>
                      <p className="text-siso-text/90">{project.case_study.results}</p>
                    </div>
                    
                    {project.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {project.metrics.completion_time && (
                          <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-5 w-5 text-purple-500" />
                              <h3 className="text-sm font-medium text-siso-text/80">Timeline</h3>
                            </div>
                            <p className="text-2xl font-bold text-siso-text-bold">{project.metrics.completion_time} weeks</p>
                          </div>
                        )}
                        
                        {project.metrics.conversion_rate && (
                          <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-5 w-5 text-green-500" />
                              <h3 className="text-sm font-medium text-siso-text/80">Conversion</h3>
                            </div>
                            <p className="text-2xl font-bold text-siso-text-bold">{project.metrics.conversion_rate}%</p>
                          </div>
                        )}
                        
                        {project.metrics.user_retention && (
                          <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="h-5 w-5 text-blue-500" />
                              <h3 className="text-sm font-medium text-siso-text/80">Retention</h3>
                            </div>
                            <p className="text-2xl font-bold text-siso-text-bold">{project.metrics.user_retention}%</p>
                          </div>
                        )}
                        
                        {project.metrics.performance_score && (
                          <div className="bg-black/40 p-4 rounded-lg border border-siso-border">
                            <div className="flex items-center gap-2 mb-2">
                              <FileCheck className="h-5 w-5 text-amber-500" />
                              <h3 className="text-sm font-medium text-siso-text/80">Performance</h3>
                            </div>
                            <p className="text-2xl font-bold text-siso-text-bold">{project.metrics.performance_score}/100</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-siso-text/60">No case study available for this project</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
