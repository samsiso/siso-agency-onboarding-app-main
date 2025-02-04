import { GradientHeading } from '@/components/ui/gradient-heading';
import { RocketIcon, BrainCircuitIcon, LayersIcon, SparklesIcon } from 'lucide-react';

export const WhyChooseSection = () => {
  const features = [
    {
      icon: RocketIcon,
      title: "Accelerated Growth",
      description: "Import proven strategies, use AI-powered tools, and leverage expert guidance to scale your agency. Our platform ensures successful implementation."
    },
    {
      icon: BrainCircuitIcon,
      title: "AI-Powered Solutions",
      description: "Get unstuck with AI assistants, automated workflows, and tools that understand your business needs. Connect with experts for real-time guidance."
    },
    {
      icon: LayersIcon,
      title: "Streamlined Operations",
      description: "Quick access to documentation, authentication, testing, and integrations. Keep track of your agency's progress with built-in management tools."
    },
    {
      icon: SparklesIcon,
      title: "Enhanced Efficiency",
      description: "Generate proposals, action plans, and reports automatically. Use our AI tools for hands-free task management and quick access to resources."
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
            Transform your business with AI-powered agency tools and resources
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