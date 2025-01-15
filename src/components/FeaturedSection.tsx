import { ArrowRight } from 'lucide-react';
import { Card } from './ui/card';

const featuredItems = [
  {
    id: 'tools',
    title: 'Core Tools & Platforms',
    description: 'Explore our key platforms, templates, and tutorials.',
    gradient: 'from-siso-red/20 to-siso-orange/20',
  },
  {
    id: 'automations',
    title: 'SISO Automations to Download',
    description: 'Save time with ready-to-use workflows and guides.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'community',
    title: 'The AI Community',
    description: 'Connect on Slack/Discord and other groups.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: 'assistants',
    title: 'ChatGPT Assistants',
    description: 'Leverage AI for quick software tips and creative ideas.',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'resources',
    title: 'Additional Resources',
    description: 'Find extra reading, success stories, and troubleshooting help.',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    id: 'siso-ai',
    title: 'SISO AI',
    description: 'Experience our cutting-edge AI solutions and tools.',
    gradient: 'from-transparent to-transparent',
    customBorder: true,
  },
];

export const FeaturedSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredItems.map((item) => (
          <Card
            key={item.title}
            id={item.id}
            className={`group relative overflow-hidden rounded-xl ${
              item.customBorder 
                ? 'border-2 border-gradient-to-r from-siso-red to-siso-orange' 
                : `bg-gradient-to-br ${item.gradient} border-0`
            } p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl scroll-mt-24`}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-siso-text-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange">
                {item.title}
              </h3>
              <p className="text-siso-text mb-4 opacity-90 group-hover:opacity-100">
                {item.description}
              </p>
              <div className="flex items-center text-siso-red group-hover:text-siso-orange transition-colors">
                <span className="mr-2 text-sm font-medium">Learn more</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Card>
        ))}
      </div>
    </div>
  );
};