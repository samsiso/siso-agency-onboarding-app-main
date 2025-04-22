
import React from 'react';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/gradient-text';
import { TeamMembersGrid } from '@/components/admin/tasks/TeamMembersGrid';
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle';
import { Users } from 'lucide-react';

export default function AdminTasks() {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-8">
        <AdminPageTitle
          icon={Users}
          title="Team Tasks Dashboard"
        >
          <div className="flex flex-col">
            <span className="text-lg font-bold">Team Tasks Dashboard</span>
            <span className="text-muted-foreground text-base mt-2">
              Click on a team member's card to view and manage their tasks, track progress, and set new goals.
            </span>
          </div>
        </AdminPageTitle>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <GradientText className="text-4xl font-bold">
            {/* The hero text is still present for visual flair */}
            Team Tasks Dashboard
          </GradientText>
        </motion.div>
        <TeamMembersGrid />
      </div>
    </AdminLayout>
  );
}
