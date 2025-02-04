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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="relative glow-card group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-siso-red to-siso-orange 
                flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-siso-red/10 to-siso-orange/10 
                  group-hover:from-siso-red/20 group-hover:to-siso-orange/20">
                  <step.icon className="w-8 h-8 text-siso-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-siso-text-bold mb-2">{step.title}</h3>
                  <p className="text-siso-text-muted">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};