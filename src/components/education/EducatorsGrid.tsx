import { motion } from 'framer-motion';
import { EducatorCard } from './EducatorCard';
import { useNavigate } from 'react-router-dom';
import { CommunityMember } from '../community/types';

interface EducatorsGridProps {
  educators: CommunityMember[];
  isLoading: boolean;
}

export const EducatorsGrid = ({ educators, isLoading }: EducatorsGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {educators.map((educator) => (
        <motion.div
          key={educator.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
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