import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, Clock, Users, Code, FileCheck, 
  Rocket, TestTube, CloudCog, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export function AgencyStepsSection() {
  // Track completed steps
  const [currentStep, setCurrentStep] = useState(3);
  
  // Define agency workflow steps
  const agencySteps = [
    {
      id: 1,
      title: "Discovery & Planning",
      description: "Initial requirements gathering, market research, and project planning",
      completed: true,
      duration: "1-2 weeks",
      team: ["Project Manager", "UI/UX Designer", "Business Analyst"],
      deliverables: ["Project Brief", "Requirements Document", "Project Timeline"]
    },
    {
      id: 2,
      title: "Design & Prototyping",
      description: "Creating wireframes, UI designs, and interactive prototypes",
      completed: true,
      duration: "2-3 weeks",
      team: ["UI/UX Designer", "Design Lead"],
      deliverables: ["Wireframes", "UI Design", "Interactive Prototype"]
    },
    {
      id: 3,
      title: "Development",
      description: "Building the core features and functionality of the application",
      completed: true,
      duration: "4-8 weeks",
      team: ["Frontend Developer", "Backend Developer", "Project Manager"],
      deliverables: ["Working Application", "Code Repository", "Technical Documentation"]
    },
    {
      id: 4,
      title: "Testing & QA",
      description: "Comprehensive testing to ensure quality and stability",
      completed: false,
      duration: "1-2 weeks",
      team: ["QA Engineer", "Developer", "Project Manager"],
      deliverables: ["Test Reports", "Bug Fixes", "Performance Metrics"]
    },
    {
      id: 5,
      title: "Deployment & Launch",
      description: "Finalizing the application and releasing it to production",
      completed: false,
      duration: "1 week",
      team: ["DevOps Engineer", "Developer", "Project Manager"],
      deliverables: ["Production Deployment", "Launch Plan", "Monitoring Setup"]
    },
    {
      id: 6,
      title: "Post-Launch Support",
      description: "Ongoing maintenance and support after launch",
      completed: false,
      duration: "Ongoing",
      team: ["Customer Support", "Developer", "Project Manager"],
      deliverables: ["Support Documentation", "Maintenance Schedule", "Future Roadmap"]
    }
  ];
  
  // Calculate overall progress
  const progress = Math.round((currentStep / agencySteps.length) * 100);
  
  return (
    <div className="space-y-8">
      <AnimatedCard className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Agency Workflow</h2>
            <p className="text-gray-300">
              Our proven step-by-step process for delivering high-quality software projects
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge variant="outline" className="text-sm bg-black/30">
              <Clock className="mr-1 h-4 w-4" />
              {progress}% Complete
            </Badge>
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Current Phase</p>
            <p className="font-medium">{agencySteps[currentStep - 1]?.title || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Time Estimate</p>
            <p className="font-medium">{agencySteps[currentStep - 1]?.duration || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Milestone</p>
            <p className="font-medium">{agencySteps[currentStep]?.title || "Project Complete"}</p>
          </div>
        </div>
      </AnimatedCard>
      
      <div className="space-y-4">
        {agencySteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AnimatedCard className={`
              border-l-4 
              ${step.completed 
                ? "border-l-green-500 bg-gradient-to-r from-green-500/10 to-transparent" 
                : index === currentStep - 1 
                  ? "border-l-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent"
                  : "border-l-gray-700"}
            `}>
              <div className="flex items-start gap-4">
                <div className={`
                  rounded-full w-8 h-8 flex items-center justify-center
                  ${step.completed 
                    ? "bg-green-500/20 text-green-400" 
                    : index === currentStep - 1 
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-800 text-gray-400"}
                `}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-gray-300 mb-3">{step.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Timeline
                      </h4>
                      <p className="text-sm">{step.duration}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Team
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {step.team.map(member => (
                          <Badge key={member} variant="outline" className="text-xs bg-black/30">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <FileCheck className="h-4 w-4 mr-1" />
                        Deliverables
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {step.deliverables.map(deliverable => (
                          <Badge key={deliverable} variant="outline" className="text-xs bg-black/30">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
