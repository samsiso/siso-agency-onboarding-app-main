
import { RainbowButton } from '@/components/ui/rainbow-button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CallToActionSection = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/auth');

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col text-center p-4 lg:p-14 gap-8 items-center">
            <motion.div 
              className="relative px-4 py-1.5 bg-gradient-to-r from-siso-red/20 to-siso-orange/20 rounded-full border border-siso-orange/30"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs font-semibold text-siso-orange flex items-center gap-1.5">
                <span className="w-2 h-2 bg-siso-orange rounded-full animate-pulse" />
                Get Started
              </span>
            </motion.div>

            <div className="flex flex-col gap-2">
              <h3 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-white">
                Try our platform today!
              </h3>
              <p className="text-lg leading-relaxed tracking-tight text-gray-300 max-w-xl">
                Managing a small business today is already tough. Avoid further
                complications by ditching outdated, tedious trade methods. Our goal
                is to streamline SMB trade, making it easier and faster than ever.
              </p>
            </div>

            <div className="flex flex-row gap-4">
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
        </div>
      </div>
    </section>
  );
};
