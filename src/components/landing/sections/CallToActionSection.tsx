
import { RainbowButton } from '@/components/ui/rainbow-button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CallToActionSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        {/* Gradient Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Background Glow Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-siso-red/10 to-siso-orange/10 blur-3xl" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl" />
          
          {/* Content Container */}
          <div className="relative p-12 rounded-2xl border border-siso-orange/20 bg-gradient-to-b from-black/60 to-transparent">
            {/* Particle Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 left-1/4 w-24 h-24 bg-siso-red/20 rounded-full blur-xl animate-float-slow" />
              <div className="absolute -bottom-8 right-1/4 w-32 h-32 bg-siso-orange/20 rounded-full blur-xl animate-float-slower" />
            </div>

            {/* Main Content */}
            <div className="text-center space-y-8">
              {/* Title with Icon */}
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="flex items-center justify-center"
                >
                  <img 
                    src="/lovable-uploads/f18bd386-e74e-4601-9d78-ade0cb831744.png" 
                    alt="SISO Logo" 
                    className="w-12 h-12 object-contain rounded-full"
                  />
                </motion.div>
                <h3 className="text-3xl md:text-4xl font-bold text-white 
                  bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80
                  drop-shadow-lg">
                  Ready to transform your business with AI?
                </h3>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed
                font-light tracking-wide">
                Connect with our experts today and discover how our
                <br className="hidden md:block" />
                innovative solutions can drive your success.
              </p>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RainbowButton 
                  className="text-lg px-12 py-6 font-semibold shadow-2xl"
                  onClick={handleGetStarted}
                >
                  Start Onboarding
                </RainbowButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
