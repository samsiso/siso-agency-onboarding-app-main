
import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { AppPlanSection } from '@/components/projects/details/AppPlanSection';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

export default function AppPlanPage() {
  return (
    <DashboardLayout>
      <Helmet>
        <title>App Plan | SISO Resource Hub</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AppPlanSection />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
