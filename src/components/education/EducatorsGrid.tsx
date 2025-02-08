
import { motion } from 'framer-motion';
import { EducatorCard } from './EducatorCard';
import { useNavigate } from 'react-router-dom';
import { CommunityMember } from '../community/types';
import { useInView } from 'react-intersection-observer';

interface EducatorsGridProps {
  educators: CommunityMember[];
  isLoading: boolean;
}

// [Analysis] Using staggered animations for better visual flow
// [Plan] Add virtualization at 100+ educators
export const EducatorsGrid = ({ educators, isLoading }: EducatorsGridProps) => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="animate-pulse h-[480px] rounded-xl bg-gradient-to-br from-siso-bg-alt/50 to-siso-bg border border-siso-border"
          >
            <div className="h-40 bg-siso-bg-alt/50 rounded-t-xl" />
            <div className="p-6">
              <div className="-mt-16">
                <div className="w-20 h-20 rounded-full bg-siso-bg-alt/50" />
              </div>
              <div className="space-y-4 mt-6">
                <div className="h-6 bg-siso-bg-alt/50 rounded-full w-3/4" />
                <div className="h-4 bg-siso-bg-alt/50 rounded-full w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-siso-bg-alt/50 rounded-full w-full" />
                  <div className="h-3 bg-siso-bg-alt/50 rounded-full w-5/6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {educators.map((educator, index) => (
        <motion.div
          key={educator.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <EducatorCard
            educator={educator}
            onClick={() => navigate(`/education/educators/${educator.slug}`)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
