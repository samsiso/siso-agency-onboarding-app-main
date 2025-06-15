import { memo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Target, Zap, BarChart3, MessageSquare, Calendar, FileText, Award, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const trainingRequirements = [
  {
    icon: BookOpen,
    title: "Basic Business Acumen",
    description: "Understanding of client needs and business fundamentals",
    level: "Required"
  },
  {
    icon: Users,
    title: "Communication Skills",
    description: "Ability to present ideas and build relationships with clients",
    level: "Required"
  },
  {
    icon: Target,
    title: "Sales Experience",
    description: "Previous sales or client-facing experience preferred",
    level: "Preferred"
  },
  {
    icon: Zap,
    title: "Tech Enthusiasm",
    description: "Interest in technology and digital solutions",
    level: "Helpful"
  }
];

const hubFeatures = [
  {
    icon: BarChart3,
    title: "Partner Dashboard",
    description: "Real-time tracking of leads, commissions, and performance metrics",
    features: ["Commission tracking", "Lead pipeline", "Performance analytics"]
  },
  {
    icon: MessageSquare,
    title: "Client Communication Hub",
    description: "Centralized platform for managing all client interactions",
    features: ["Chat integration", "Project updates", "Feedback management"]
  },
  {
    icon: Calendar,
    title: "Project Management",
    description: "Track project timelines, milestones, and deliverables",
    features: ["Timeline tracking", "Milestone alerts", "Delivery schedules"]
  },
  {
    icon: FileText,
    title: "Resource Library",
    description: "Access to sales materials, case studies, and training content",
    features: ["Sales templates", "Case studies", "Training videos"]
  },
  {
    icon: Award,
    title: "Certification System",
    description: "Structured learning path with partner certifications",
    features: ["Learning modules", "Skill assessments", "Digital badges"]
  }
];

export const PartnershipTraining = memo(() => {
  return (
    <div id="training" className="w-full px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Training Requirements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Partner <span className="text-orange-500">Requirements</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            We welcome partners from diverse backgrounds. Here's what helps you succeed in our program.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {trainingRequirements.map((requirement, index) => (
              <motion.div
                key={requirement.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1
                }}
                className="group"
              >
                <Card className="relative h-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 
                  border border-gray-700/50 hover:border-orange-500/50 backdrop-blur-sm
                  transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20
                  group-hover:scale-105">
                  
                  <CardContent className="relative p-6 space-y-4">
                    {/* Level Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        requirement.level === 'Required' 
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : requirement.level === 'Preferred'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {requirement.level}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 via-orange-600/30 to-red-500/20 
                      rounded-xl flex items-center justify-center mb-4
                      shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40
                      border border-orange-500/20 group-hover:border-orange-500/40
                      transition-all duration-500">
                      <requirement.icon className="w-6 h-6 text-orange-400" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-100 transition-colors duration-300">
                      {requirement.title}
                    </h3>
                    
                    <p className="text-sm text-gray-300 group-hover:text-gray-200 leading-relaxed transition-colors duration-300">
                      {requirement.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partnership Hub Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Your Partner <span className="text-orange-500">Hub</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Everything you need to succeed, all in one powerful platform designed specifically for our partners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hubFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.15
                }}
                className="group"
              >
                <Card className="relative h-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 
                  border border-gray-700/50 hover:border-orange-500/50 backdrop-blur-sm
                  transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20
                  group-hover:scale-105">
                  
                  <CardContent className="relative p-8 space-y-6">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 via-orange-600/30 to-red-500/20 
                      rounded-xl flex items-center justify-center mb-6 mx-auto
                      shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40
                      border border-orange-500/20 group-hover:border-orange-500/40
                      transition-all duration-500">
                      <feature.icon className="w-8 h-8 text-orange-400" />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white group-hover:text-orange-100 transition-colors duration-300 mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-300 group-hover:text-gray-200 leading-relaxed mb-6 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* Feature List */}
                      <div className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                            className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span>{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Getting Started CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 
            backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8
            max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get <span className="text-orange-500">Started?</span>
            </h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Join our next partner onboarding session and get access to your personalized hub within 24 hours.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400 mb-2">24 Hours</div>
                <div className="text-sm text-gray-400">Hub Access After Approval</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-400 mb-2">7 Days</div>
                <div className="text-sm text-gray-400">Complete Training Program</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

PartnershipTraining.displayName = 'PartnershipTraining'; 