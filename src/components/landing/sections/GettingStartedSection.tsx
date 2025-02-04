import { GradientHeading } from '@/components/ui/gradient-heading';
import { UserPlusIcon, ClipboardCheckIcon, RocketIcon } from 'lucide-react';

export const GettingStartedSection = () => {
  const steps = [
    {
      icon: UserPlusIcon,
      title: "Create Your Account",
      description: "Get started by signing up for SISO Resources. It's quick, easy, and designed for agency owners."
    },
    {
      icon: ClipboardCheckIcon,
      title: "Complete Onboarding",
      description: "Tell us about your agency and goals so we can personalize your experience and recommendations."
    },
    {
      icon: RocketIcon,
      title: "Access Resources",
      description: "Experience the power of AI-assisted agency growth with smart features and automation tools."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgb(255 255 255 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <GradientHeading variant="secondary" className="text-4xl md:text-5xl font-bold mb-4">
            Start Growing in Minutes
          </GradientHeading>
          <p className="text-lg text-siso-text-muted max-w-2xl mx-auto">
            Follow these simple steps to supercharge your agency's potential
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative glow-card group flex items-start gap-8"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-siso-red to-siso-orange 
                flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="p-4 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 
                  group-hover:from-siso-red/20 group-hover:to-siso-orange/20">
                  <step.icon className="w-8 h-8 text-siso-orange" />
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-semibold text-siso-text-bold mb-2">{step.title}</h3>
                <p className="text-siso-text-muted">{step.description}</p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute bottom-0 left-12 w-px h-12 bg-gradient-to-b from-siso-red/20 to-siso-orange/20 
                  transform translate-y-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};