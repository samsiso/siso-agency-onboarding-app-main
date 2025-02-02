import { TestimonialCard } from './TestimonialCard';

// [Analysis] Sample testimonial data - in a real app, this would come from an API or CMS
const testimonials = [
  {
    name: "Sarah K.",
    role: "Digital Marketing Director",
    company: "Growth Co",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The AI tools have revolutionized how we approach client campaigns. Our efficiency has increased by 300%.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://example.com/video1.mp4"
  },
  {
    name: "Michael R.",
    role: "Agency Owner",
    company: "Digital Spark",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Lovable's resource hub has been a game-changer. The ROI from implementing these tools has been incredible.",
    linkedinUrl: "https://linkedin.com"
  },
  {
    name: "Lisa M.",
    role: "Operations Manager",
    company: "Tech Solutions",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The educational resources and community support have helped us scale our agency beyond expectations.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://example.com/video2.mp4"
  },
  {
    name: "David W.",
    role: "Marketing Strategist",
    company: "Innovate Digital",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The automation capabilities have transformed our workflow. We're seeing incredible results with minimal effort.",
    linkedinUrl: "https://linkedin.com"
  },
  {
    name: "Emily T.",
    role: "Lead Strategist",
    company: "Pipeline Analytics",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The level of personalization we achieve with Lovable is incredible. Our engagement rates have skyrocketed.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://example.com/video3.mp4"
  },
  {
    name: "James H.",
    role: "CEO",
    company: "Growth Accelerator",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Since implementing Lovable, we've seen a 250% increase in client satisfaction and retention rates.",
    linkedinUrl: "https://linkedin.com"
  },
  {
    name: "Christina M.",
    role: "Digital Operations Lead",
    company: "Tech Innovations",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The AI-powered insights have given us a competitive edge in the market. Simply outstanding.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://example.com/video4.mp4"
  },
  {
    name: "Robert P.",
    role: "Agency Director",
    company: "Digital Ventures",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Lovable has streamlined our entire operation. The ROI has exceeded all our expectations.",
    linkedinUrl: "https://linkedin.com"
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-siso-orange/5 via-transparent to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            What Our Partners Say About Lovable
          </h2>
          <p className="text-xl text-gray-400">
            Real stories from businesses that have grown with Lovable's solutions
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}