
import { motion } from 'framer-motion';
import { EducatorCard } from './EducatorCard';
import { CommunityMember } from '../community/types';
import { useInView } from 'react-intersection-observer';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface EducatorsGridProps {
  educators: CommunityMember[];
  isLoading: boolean;
}

// [Analysis] Using staggered animations for better visual flow
// [Plan] Add virtualization at 100+ educators
export const EducatorsGrid = ({ educators, isLoading }: EducatorsGridProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const getSyncStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

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
          className="relative"
        >
          {educator.sync_status && (
            <div className="absolute top-2 right-2 z-10">
              {getSyncStatusIcon(educator.sync_status)}
            </div>
          )}
          <EducatorCard educator={educator} />
        </motion.div>
      ))}
    </motion.div>
  );
};
