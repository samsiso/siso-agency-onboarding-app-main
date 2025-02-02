import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

// [Analysis] Structured data for easy maintenance and updates
const testimonials = [
  {
    name: "Sarah K.",
    role: "Digital Marketing Director",
    company: "Growth Co",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The AI tools have revolutionized how we approach client campaigns. Our efficiency has increased by 300%.",
    videoUrl: "https://www.youtube.com/embed/your-video-id-1"
  },
  {
    name: "Michael R.",
    role: "Agency Owner",
    company: "Digital Spark",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "SISO's resource hub has been a game-changer. The ROI from implementing these tools has been incredible.",
    videoUrl: "https://www.youtube.com/embed/your-video-id-2"
  },
  {
    name: "Lisa M.",
    role: "Operations Manager",
    company: "Tech Solutions",
    image: "/lovable-uploads/c5921a2f-8856-42f4-bec5-2d08b81c5691.png",
    quote: "The educational resources and community support have helped us scale our agency beyond expectations.",
    videoUrl: "https://www.youtube.com/embed/your-video-id-3"
  }
];

export const TestimonialSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative p-6 rounded-xl backdrop-blur-sm border border-white/10 
                bg-black/30 transition-all duration-300 hover:scale-105 hover:border-white/20"
            >
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-12 w-12">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover border-2 border-siso-orange/20"
                  />
                  <button
                    onClick={() => setSelectedVideo(testimonial.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Play className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-400 text-sm">{testimonial.company}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-300 italic text-left">"{testimonial.quote}"</p>

              {/* Watch Video Button */}
              <button
                onClick={() => setSelectedVideo(testimonial.videoUrl)}
                className="mt-4 text-siso-orange hover:text-siso-orange/80 text-sm flex items-center gap-2
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Play className="w-4 h-4" />
                Watch Testimonial
              </button>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        <Dialog 
          open={!!selectedVideo} 
          onOpenChange={() => setSelectedVideo(null)}
        >
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black/95 p-4 rounded-lg w-full max-w-4xl">
              {selectedVideo && (
                <iframe
                  src={selectedVideo}
                  className="w-full aspect-video rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </section>
  );
};