
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Bot, Users, Zap, Globe } from 'lucide-react';

export const WhyChooseSection = () => {
  const features = [
    {
      icon: Bot,
      title: "Custom AI Agency Agent",
      description: "Experience our AI agent that learns your agency's unique needs, analyzes our resource bank, and delivers personalized recommendations for tools and growth strategies."
    },
    {
      icon: Users,
      title: "Community Insights",
      description: "Learn from over 1,000 successful agency owners. See exactly which solutions are driving results for agencies like yours and implement proven strategies in your business."
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Stay ahead with a platform that updates multiple times daily. Get instant access to new technologies and implementation guides as soon as they become available."
    },
    {
      icon: Globe,
      title: "Integrated Resource Hub",
      description: "Access a comprehensive suite of agency tools, step-by-step implementation guides, and educational resources - all designed to help you scale efficiently."
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <GradientHeading variant="secondary" className="text-4xl md:text-5xl font-bold mb-4">
            Supercharge Your Agency Growth
          </GradientHeading>
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
            Transform your business with AI-powered tools and proven strategies from successful agency owners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glow-card group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 group-hover:from-siso-red/20 group-hover:to-siso-orange/20">
                  <feature.icon className="w-6 h-6 text-siso-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-siso-text-bold mb-2">{feature.title}</h3>
                  <p className="text-siso-text-muted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
