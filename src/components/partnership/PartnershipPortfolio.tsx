import { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Code, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  status: 'Live' | 'Demo' | 'Custom';
  priceRange: string;
  commission: string;
  technologies: string[];
  buttonText: string;
  buttonIcon: React.ComponentType<any>;
}

interface PartnershipPortfolioProps {
  onApplyNow: () => void;
}

const portfolioProjects: PortfolioProject[] = [
  {
    id: 'event-management',
    title: 'Event Management Majorca',
    description: 'Complete event management platform with booking, payments, and client communication for luxury events in Majorca.',
    status: 'Live',
    priceRange: '€2,500-€5,000',
    commission: '€500-€1,000',
    technologies: ['React', 'Stripe', 'Calendar'],
    buttonText: 'View Live',
    buttonIcon: ExternalLink
  },
  {
    id: 'restaurant-system',
    title: 'Restaurant Management System',
    description: 'Online ordering, table reservations, menu management, and customer reviews system for restaurants.',
    status: 'Demo',
    priceRange: '£1,500-£3,500',
    commission: '£300-£700',
    technologies: ['React', 'Orders', 'Reviews'],
    buttonText: 'View Demo',
    buttonIcon: Eye
  },
  {
    id: 'barber-booking',
    title: 'Barber Shop Booking System',
    description: 'Appointment booking, service showcase, staff management, and customer profiles for barbershops.',
    status: 'Demo',
    priceRange: '£800-£2,000',
    commission: '£160-£400',
    technologies: ['Booking', 'Calendar', 'Staff'],
    buttonText: 'View Demo',
    buttonIcon: Eye
  },
  {
    id: 'crypto-platform',
    title: 'Crypto Trading Platform',
    description: 'Full-featured crypto trading app with portfolio tracking, real-time prices, and secure wallet integration.',
    status: 'Custom',
    priceRange: '£5,000-£15,000',
    commission: '£1,000-£3,000',
    technologies: ['Trading', 'Wallet', 'Analytics'],
    buttonText: 'Custom Build',
    buttonIcon: Code
  },
  {
    id: 'property-management',
    title: 'Property Management System',
    description: 'Complete property management with tenant portals, maintenance requests, and financial reporting.',
    status: 'Live',
    priceRange: '£3,000-£8,000',
    commission: '£600-£1,600',
    technologies: ['Tenants', 'Finance', 'Reports'],
    buttonText: 'View Live',
    buttonIcon: ExternalLink
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Live':
      return 'bg-green-500/30 text-green-200';
    case 'Demo':
      return 'bg-blue-500/30 text-blue-200';
    case 'Custom':
      return 'bg-purple-500/30 text-purple-200';
    default:
      return 'bg-gray-500/30 text-gray-200';
  }
};

const getTechColor = (index: number) => {
  const colors = [
    'bg-blue-500/20 text-blue-300',
    'bg-green-500/20 text-green-300',
    'bg-purple-500/20 text-purple-300',
    'bg-yellow-500/20 text-yellow-300',
    'bg-red-500/20 text-red-300'
  ];
  return colors[index % colors.length];
};

export const PartnershipPortfolio = memo(({ onApplyNow }: PartnershipPortfolioProps) => {
  return (
    <section id="portfolio" className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-gray-800/30">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Our <span className="text-orange-500">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the quality of work your referrals will receive. These are real projects we've built for clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project, index) => {
            const IconComponent = project.buttonIcon;
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 hover:border-orange-500/50 transition-all duration-300 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/5 transition-all duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 text-sm rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </div>
                      <div className="text-orange-500 font-bold">{project.priceRange}</div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={tech}
                          className={`px-2 py-1 text-xs rounded ${getTechColor(techIndex)}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-green-400 font-semibold">Commission: {project.commission}</div>
                      <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                        <IconComponent className="w-4 h-4 mr-2" />
                        {project.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* More Templates Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="group relative"
          >
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 overflow-hidden h-full border-dashed">
              <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">More Templates</h3>
                <p className="text-gray-400 mb-4">Healthcare, Education, E-commerce, and more industry-specific templates coming soon.</p>
                
                <div className="px-3 py-1 bg-orange-500/30 text-orange-200 text-sm rounded-full">
                  Coming Soon
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Portfolio CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-300 mb-6">
            This is the quality of work your referrals will receive. Ready to start earning?
          </p>
          <Button 
            onClick={onApplyNow}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg"
          >
            Apply Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}); 