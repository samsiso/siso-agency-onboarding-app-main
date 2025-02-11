
import { TestimonialCard } from './TestimonialCard';

// [Analysis] Sample testimonial data - alternating video and audio reviews for visual balance
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
    name: "Lisa M.",
    role: "Content Strategy Lead",
    company: "Content Kings",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Finally, a platform that understands what modern agencies need. The automation tools are exceptional.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
  },
  {
    name: "James H.",
    role: "Technical Director",
    company: "Web Wizards",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The AI features are cutting-edge and actually deliver real value. Our team's productivity has skyrocketed.",
    linkedinUrl: "https://linkedin.com",
    audioReview: true
  },
  {
    name: "Emma T.",
    role: "Operations Manager",
    company: "Tech Solutions Ltd",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Integration was seamless and the support team is incredibly responsive. A must-have for modern agencies.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
  },
  {
    name: "David W.",
    role: "Marketing Strategist",
    company: "Innovate Digital",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The automation capabilities have transformed our workflow. We're seeing incredible results with minimal effort.",
    linkedinUrl: "https://linkedin.com",
    audioReview: true
  },
  {
    name: "Rachel D.",
    role: "Agency Founder",
    company: "Digital Dreams",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "Lovable has become an essential part of our tech stack. The continuous improvements keep getting better.",
    linkedinUrl: "https://linkedin.com",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
  },
  {
    name: "Alex P.",
    role: "Growth Specialist",
    company: "Scale Up Agency",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The platform paid for itself within the first month. The AI capabilities are genuinely impressive.",
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

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance] space-y-4 md:space-y-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="break-inside-avoid animate-fade-in"
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
