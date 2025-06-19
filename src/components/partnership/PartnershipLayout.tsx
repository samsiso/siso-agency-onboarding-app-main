import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { PartnershipSidebar } from './PartnershipSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface PartnershipLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function PartnershipLayout({ 
  children, 
  title,
  subtitle,
  actions 
}: PartnershipLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-black">
      {/* Partnership Sidebar */}
      <PartnershipSidebar />
      
      {/* Main Content Area */}
      <motion.main 
        className="flex-1 overflow-y-auto"
        animate={{
          marginLeft: !isMobile ? '4rem' : 0
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
      >
        {/* Page Header */}
        {(title || subtitle || actions) && (
          <div className="bg-black border-b border-orange-500/20 px-4 py-6 lg:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-gray-400">{subtitle}</p>
                  )}
                </div>
                {actions && (
                  <div className="flex items-center space-x-4">
                    {actions}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}