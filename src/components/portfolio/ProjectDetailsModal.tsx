import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code, Building, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  if (!project) return null;

  const getProjectDetails = (projectName: string) => {
    const details = {
      'Gritness Gym': {
        industry: 'Fitness & Health',
        description: 'A comprehensive fitness platform that revolutionizes gym management and member experience. Features include class scheduling, membership management, trainer profiles, and workout tracking.',
        keyFeatures: [
          'Real-time class scheduling system',
          'Membership management portal',
          'Trainer profile and booking system',
          'Workout tracking and progress analytics',
          'Mobile-responsive design'
        ],
        businessValue: 'Increased member engagement by 40% and streamlined gym operations'
      },
      'UbahCryp': {
        industry: 'Financial Technology',
        description: 'Advanced cryptocurrency trading platform with real-time market data, secure wallet integration, and intelligent trading tools for both novice and professional traders.',
        keyFeatures: [
          'Real-time cryptocurrency market data',
          'Secure wallet integration',
          'Advanced trading charts and analytics',
          'Multi-currency support',
          'Mobile trading application'
        ],
        businessValue: 'Processing $2M+ in monthly trading volume with 99.9% uptime'
      },
      'Elementree': {
        industry: 'Food & Beverage',
        description: 'Modern restaurant management system with online ordering, reservation management, and customer engagement tools that enhance dining experiences.',
        keyFeatures: [
          'Online ordering and delivery system',
          'Table reservation management',
          'Digital menu with real-time updates',
          'Customer loyalty program',
          'Kitchen workflow optimization'
        ],
        businessValue: 'Increased online orders by 60% and improved customer satisfaction scores'
      },
      'Trojan MMA': {
        industry: 'Sports & Training',
        description: 'Comprehensive Mixed Martial Arts gym platform featuring class management, fighter profiles, training programs, and event management systems.',
        keyFeatures: [
          'Class scheduling and attendance tracking',
          'Fighter profile and statistics',
          'Training program management',
          'Event and competition tracking',
          'Progress monitoring tools'
        ],
        businessValue: 'Improved student retention by 35% through better engagement tools'
      },
      'NM Construction': {
        industry: 'Construction',
        description: 'Professional construction company platform showcasing projects, services, and expertise with integrated project management and client communication tools.',
        keyFeatures: [
          'Project portfolio showcase',
          'Service catalog and quotes',
          'Client communication portal',
          'Project timeline tracking',
          'Before/after gallery system'
        ],
        businessValue: 'Generated 50% more qualified leads through professional online presence'
      },
      'OPTIMAL CONSTRUCTION': {
        industry: 'Building Maintenance',
        description: 'Building maintenance and construction services platform with service booking, project tracking, and customer management capabilities.',
        keyFeatures: [
          'Service booking and scheduling',
          'Project tracking dashboard',
          'Customer relationship management',
          'Maintenance request system',
          'Invoice and payment processing'
        ],
        businessValue: 'Streamlined operations and improved customer response time by 45%'
      },
      'Lets Go': {
        industry: 'Social Networking',
        description: 'Social networking and event planning application that connects people through shared interests and location-based activities.',
        keyFeatures: [
          'Event creation and management',
          'Social networking features',
          'Location-based discovery',
          'User profile and preferences',
          'Real-time messaging system'
        ],
        businessValue: 'Facilitated 10,000+ social connections and events in first year'
      },
      'Mu Shin': {
        industry: 'Education & Training',
        description: 'Self-defense training platform offering structured video courses, progress tracking, and certification programs for martial arts students.',
        keyFeatures: [
          'Video course library',
          'Progress tracking system',
          'Certification programs',
          'Interactive learning tools',
          'Student community features'
        ],
        businessValue: 'Enabled remote learning for 500+ students with 95% completion rates'
      },
      '5 Star Hire': {
        industry: 'Automotive Rental',
        description: 'Premium car rental service platform with advanced booking system, fleet management, and customer service tools for luxury vehicle rentals.',
        keyFeatures: [
          'Advanced booking system',
          'Fleet management tools',
          'Customer service portal',
          'Insurance and documentation',
          'Mobile app integration'
        ],
        businessValue: 'Increased booking efficiency by 50% and customer satisfaction to 4.8/5'
      }
    };
    return details[projectName as keyof typeof details] || {
      industry: 'Technology',
      description: 'Custom digital solution built to meet specific business requirements.',
      keyFeatures: ['Custom development', 'Modern technology stack', 'Scalable architecture'],
      businessValue: 'Delivered measurable business improvements'
    };
  };

  const projectDetails = getProjectDetails(project.project_name);

  const handleViewApp = () => {
    window.open(project.live_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-black border border-gray-800">
                <CardHeader className="border-b border-gray-800 pb-6">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Project Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-siso-orange to-siso-red flex items-center justify-center text-white font-bold text-xl">
                      {project.project_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-white mb-2">
                        {project.project_name}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{project.profile?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{projectDetails.industry}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="px-3 py-1 text-xs bg-siso-orange/20 text-siso-orange rounded-full border border-siso-orange/30">
                          Live & Active
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Project Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Project Overview</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {projectDetails.description}
                    </p>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                    <ul className="space-y-2">
                      {projectDetails.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <div className="w-1.5 h-1.5 bg-siso-orange rounded-full mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full border border-gray-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Business Impact */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Business Impact</h3>
                    <p className="text-siso-orange font-medium">
                      {projectDetails.businessValue}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleViewApp}
                      className="bg-siso-orange hover:bg-siso-orange/90 text-black font-medium flex items-center gap-2 flex-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live Application
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 