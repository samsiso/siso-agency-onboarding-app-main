import { ArrowRight } from 'lucide-react';

const featuredItems = [
  {
    title: 'Featured Tools',
    description: 'Discover our curated collection of powerful agency tools',
    link: '#tools',
  },
  {
    title: 'Active Communities',
    description: 'Connect with like-minded agency professionals',
    link: '#communities',
  },
  {
    title: 'Popular Automations',
    description: 'Streamline your workflow with our automation templates',
    link: '#automations',
  },
  {
    title: 'Free Resources',
    description: 'Access our library of templates and guides',
    link: '#resources',
  },
];

export const FeaturedSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredItems.map((item) => (
          <a
            key={item.title}
            href={item.link}
            className="glow-card group"
          >
            <h3 className="text-xl font-semibold text-siso-text-bold mb-2">
              {item.title}
            </h3>
            <p className="text-siso-text mb-4">{item.description}</p>
            <div className="flex items-center text-siso-red group-hover:text-siso-orange transition-colors">
              <span className="mr-2">Learn more</span>
              <ArrowRight size={16} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};