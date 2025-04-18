
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { TeamMembersGrid } from '@/components/admin/tasks/TeamMembersGrid';

export default function AdminTasks() {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <GradientText className="text-4xl font-bold">
            Team Tasks Dashboard
          </GradientText>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Click on a team member's card to view and manage their tasks, track progress, and set new goals.
          </p>
        </motion.div>

        <TeamMembersGrid />
      </div>
    </AdminLayout>
  );
}
