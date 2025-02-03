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
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
  },
  {
    name: "Michael R.",
    role: "Agency Owner",
    company: "Digital Spark",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Lovable's resource hub has been a game-changer. The ROI from implementing these tools has been incredible.",
    linkedinUrl: "https://linkedin.com",
    audioReview: true
  },
  {
    name: "David W.",
    role: "Marketing Strategist",
    company: "Innovate Digital",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The automation capabilities have transformed our workflow. We're seeing incredible results with minimal effort.",
    linkedinUrl: "https://linkedin.com",
    audioReview: true
  }
];

export function TestimonialSection() {
  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-siso-orange/5 via-transparent to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            What Our Partners Say About Lovable
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
            Real stories from businesses that have grown with Lovable's solutions
          </p>
        </div>

        {/* Mobile-optimized Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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