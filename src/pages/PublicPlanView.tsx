import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  Linkedin,
  Twitter,
  Star,
  Shield,
  Users,
  Award
} from 'lucide-react';

// Define types for plan data
interface PlanData {
  title: string;
  company: string;
  sections: {
    overview: string;
    features: string[];
    timeline: string;
    pricing: string;
    contact: string;
  };
  created_at: string;
  view_count: number;
}

interface MockPlanData {
  [key: string]: PlanData;
}

// Mock plan data for demonstration
const mockPlanData: MockPlanData = {
  'juice-bar': {
    title: 'Juice Bar Mobile App Development Plan',
    company: 'SISO Agency',
    sections: {
      overview: `We'll create a comprehensive mobile application for your juice bar that allows customers to browse your menu, customize orders, make payments, and schedule pickups. This solution includes both iOS and Android versions with a robust admin panel for order management and analytics.

The app will feature modern UI/UX design with vibrant branding, secure payment processing, real-time order tracking, and comprehensive analytics dashboard for business insights.`,
      features: [
        'User Registration & Profiles',
        'Interactive Menu with Nutritional Info',
        'Custom Juice Builder with Ingredients',
        'Secure Payment Gateway',
        'Order Scheduling & Pickup Times',
        'Loyalty Program Integration',
        'Push Notifications for Order Updates',
        'Admin Dashboard for Order Management',
        'Inventory Management System',
        'Customer Analytics & Insights',
        'Social Media Integration',
        'Review & Rating System'
      ],
      timeline: `Phase 1: UI/UX Design & Branding (2 weeks)
Phase 2: Backend Development & API Setup (3 weeks)
Phase 3: Mobile App Development (5 weeks)
Phase 4: Payment & Loyalty Integration (2 weeks)
Phase 5: Admin Panel Development (2 weeks)
Phase 6: Testing & App Store Deployment (1 week)

Total Duration: 15 weeks`,
      pricing: `Development Cost: $32,000
Includes:
• Native mobile apps for iOS & Android
• Admin web dashboard
• Payment gateway integration
• Loyalty program system
• 3 months of post-launch support
• Source code & documentation
• App store submission assistance

Payment Terms:
• 30% upfront ($9,600)
• 40% at midpoint milestone ($12,800)
• 30% upon completion ($9,600)`,
      contact: `Ready to boost your juice bar business?

📧 Email: hello@sisoagency.com
📞 Phone: +1 (555) 123-4567
🌐 Website: www.sisoagency.com

Next Steps:
1. Schedule a discovery call to discuss your specific needs
2. Finalize menu structure & branding requirements
3. Sign contract & begin development
4. Weekly progress updates & demos
5. Launch your app and grow your business!`
    },
    created_at: new Date().toISOString(),
    view_count: 5
  },
  'ecommerce-app-development-plan': {
    title: 'E-commerce App Development Plan',
    company: 'SISO Agency',
    sections: {
      overview: `We'll create a comprehensive e-commerce mobile application that allows customers to browse products, make purchases, and track orders seamlessly. This solution includes both iOS and Android versions with a robust admin panel for inventory management.

The app will feature modern UI/UX design, secure payment processing, real-time inventory tracking, and comprehensive analytics dashboard for business insights.`,
      features: [
        'User Authentication & Profiles',
        'Product Catalog with Search & Filters',
        'Shopping Cart & Wishlist',
        'Secure Payment Gateway Integration',
        'Order Tracking & History',
        'Push Notifications',
        'Admin Dashboard for Inventory Management',
        'Analytics & Reporting',
        'Multi-language Support',
        'Customer Reviews & Ratings'
      ],
      timeline: `Phase 1: UI/UX Design & Wireframes (2 weeks)
Phase 2: Backend Development & API Setup (3 weeks)
Phase 3: Frontend Development (4 weeks)
Phase 4: Payment Integration & Testing (2 weeks)
Phase 5: Admin Dashboard Development (2 weeks)
Phase 6: Testing, Bug Fixes & Deployment (1 week)

Total Duration: 14 weeks`,
      pricing: `Development Cost: $45,000
Includes:
• Complete mobile app for iOS & Android
• Admin web dashboard
• 3 months of post-launch support
• Source code & documentation
• App store submission assistance

Payment Terms:
• 30% upfront
• 40% at midpoint milestone
• 30% upon completion`,
      contact: `Ready to get started?

📧 Email: hello@sisoagency.com
📞 Phone: +1 (555) 123-4567
🌐 Website: www.sisoagency.com

Next Steps:
1. Schedule a discovery call
2. Finalize requirements & timeline
3. Sign contract & begin development
4. Regular progress updates & demos`
    },
    created_at: new Date().toISOString(),
    view_count: 12
  },
  'social-media-dashboard-plan': {
    title: 'Social Media Dashboard Plan',
    company: 'SISO Agency', 
    sections: {
      overview: `A comprehensive social media management dashboard that helps businesses monitor, schedule, and analyze their social media presence across multiple platforms including Facebook, Instagram, Twitter, LinkedIn, and TikTok.`,
      features: [
        'Multi-platform social media integration',
        'Content scheduling & automation',
        'Analytics & performance tracking',
        'Team collaboration tools',
        'Content calendar view',
        'Engagement monitoring'
      ],
      timeline: `Phase 1: Research & Design (2 weeks)
Phase 2: Backend & API Integration (3 weeks)
Phase 3: Frontend Dashboard (3 weeks)
Phase 4: Testing & Deployment (1 week)

Total Duration: 9 weeks`,
      pricing: `Development Cost: $28,000
3 months post-launch support included`,
      contact: `Contact us to start your project!
Email: hello@sisoagency.com`
    },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    view_count: 8
  }
};

export default function PublicPlanView() {
  const { slug } = useParams<{ slug: string }>();
  
  // Get plan data (in real implementation, this would fetch from API)
  const planData = slug ? mockPlanData[slug] : null;

  if (!planData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
          <p className="text-gray-400">The requested plan could not be found.</p>
        </div>
      </div>
    );
  }

  const sectionIcons: Record<string, any> = {
    overview: FileText,
    features: Sparkles,
    timeline: Calendar,
    pricing: DollarSign,
    contact: Phone
  };

  const sectionTitles: Record<string, string> = {
    overview: '📋 Project Overview',
    features: '✨ Key Features',
    timeline: '📅 Timeline & Phases',
    pricing: '💰 Investment',
    contact: '📞 Next Steps'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Professional Hero Header */}
      <div className="relative bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 border-b border-gray-700/50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/siso-logo.svg" 
                alt="SISO Agency" 
                className="h-12 w-12 filter brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold text-white">SISO Agency</h3>
                <p className="text-sm text-orange-400 font-medium">Premium Development Solutions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{planData.view_count} views</span>
              </div>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                <Award className="w-3 h-3 mr-1" />
                Premium Plan
              </Badge>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-4xl">
            <div className="flex items-center space-x-2 text-orange-400 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              <span>Confidential Project Proposal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {planData.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-300">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="font-medium">Expert Development Team</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-medium">Proven Success Record</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-medium">Premium Support Included</span>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
              <Mail className="mr-2 w-5 h-5" />
              Discuss This Project
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Phone className="mr-2 w-5 h-5" />
              Schedule Call
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <ExternalLink className="mr-2 w-5 h-5" />
              View Portfolio
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(planData.sections).map(([sectionKey, content]) => {
              const Icon = sectionIcons[sectionKey] || FileText;
              
              return (
                <Card key={sectionKey} className="border-gray-700/50 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-white text-xl">
                      <div className="p-2 bg-orange-500/20 rounded-lg mr-4">
                        <Icon className="h-6 w-6 text-orange-400" />
                      </div>
                      {sectionTitles[sectionKey] || sectionKey}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sectionKey === 'features' && Array.isArray(content) ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {(content as string[]).map((feature, index) => (
                          <div key={index} className="flex items-start text-gray-300">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-lg">
                        {content as string}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contact Card */}
            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-orange-400" />
                  Get Started Today
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Ready to transform your business with this solution? Let's discuss your specific needs.
                </p>
                <div className="space-y-3">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    <Mail className="mr-2 w-4 h-4" />
                    hello@sisoagency.com
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Phone className="mr-2 w-4 h-4" />
                    +1 (555) 123-4567
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Why Choose SISO?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">5+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-sm">50+ Projects Delivered</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm">100% Client Satisfaction</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">Post-Launch Support</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/siso-logo.svg" 
                  alt="SISO Agency" 
                  className="h-10 w-10 filter brightness-0 invert"
                />
                <div>
                  <h3 className="text-lg font-bold text-white">SISO Agency</h3>
                  <p className="text-sm text-orange-400">Premium Development Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                We build exceptional digital experiences that drive business growth. 
                From mobile apps to complex web platforms, we deliver solutions that exceed expectations.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Get In Touch</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>hello@sisoagency.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4 text-orange-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>www.sisoagency.com</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Ready to Start?</h4>
              <p className="text-gray-400 text-sm">
                Let's discuss how we can bring your vision to life with cutting-edge technology.
              </p>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                <ArrowRight className="mr-2 w-4 h-4" />
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 SISO Agency. All rights reserved. | Premium Development Solutions
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Globe className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 