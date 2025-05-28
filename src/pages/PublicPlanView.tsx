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
  Clock
} from 'lucide-react';

// Mock plan data for demonstration
const mockPlanData = {
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Plan Not Found</h1>
          <p className="text-gray-400">The requested plan could not be found.</p>
        </div>
      </div>
    );
  }

  const sectionIcons = {
    overview: FileText,
    features: Sparkles,
    timeline: Calendar,
    pricing: DollarSign,
    contact: Phone
  };

  const sectionTitles = {
    overview: '📋 Project Overview',
    features: '✨ Key Features',
    timeline: '📅 Timeline & Phases',
    pricing: '💰 Investment',
    contact: '📞 Next Steps'
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{planData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="text-purple-400 font-medium">{planData.company}</span>
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {planData.view_count} views
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              Professional Plan
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {Object.entries(planData.sections).map(([sectionKey, content]) => {
            const Icon = sectionIcons[sectionKey] || FileText;
            
            return (
              <Card key={sectionKey} className="border-gray-700 bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Icon className="mr-3 h-6 w-6 text-purple-400" />
                    {sectionTitles[sectionKey] || sectionKey}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sectionKey === 'features' && Array.isArray(content) ? (
                    <ul className="space-y-3">
                      {(content as string[]).map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {content as string}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Ready to Start Your Project?</h3>
          <p className="text-gray-400 mb-6">
            Let's discuss your requirements and bring this plan to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Mail className="mr-2 w-4 h-4" />
              Get In Touch
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <ExternalLink className="mr-2 w-4 h-4" />
              View Portfolio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 