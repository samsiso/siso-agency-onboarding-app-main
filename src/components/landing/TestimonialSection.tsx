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
  }
];

export function TestimonialSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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